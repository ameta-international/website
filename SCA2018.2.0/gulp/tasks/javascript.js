/* jshint node: true */

/*
@module gulp.javascript
#gulp javascript

This gulp task will compile the project's javascript output. It support two different kind of compilation:

## Compiling for production

For generating production code we use the amd-optimizer build tool that will generate all the required
JavaScript code dependencies from a application's Starter.js file that is declared in distro.json file
property javascript->entryPoint. Then, some extra tools like minification thorough uglify and/or sourcemap.
Also for performance reasons the final output is transformed using the tool amdclean.
can be done as well. Examples:

	gulp javascript
	gulp javascript --js require
	gulp javascript --nouglify

Notice that generating sourcemaps or running uglify can take longer.

##Compiling for development

We support compilation type suited for development using the argument '--js require'. This will generate a requirejs
config file pointing to the real files in Modules/. This way you don't need to do any compilation on your JavaScript
files, just save them and reload your browser. This task is called indirectly when running our development environment using:

	gulp local --js require

##Declaring javascript in ns.package.json

The javascript files that are able to be compiled are those referenced by the property gulp.javascript
in module's ns.package.json file. Also the compiled templates (using gulp templates). Example:

	{
		"gulp": {
			...
		,	"javascript": [
				"JavaScript/*"
			]
		}
	}

*/

'use strict';

var path = require('path')

,	gulp = require('gulp')
,	_ = require('underscore')

,	package_manager = require('../package-manager')
,	fs = require('fs')
,	File = require('vinyl')
,	through = require('through')

,	amdOptimize = require('gulp-requirejs-optimize')
,	sourcemaps = require('gulp-sourcemaps')
,	uglify = require('gulp-uglify')
,	concat = require('gulp-concat')
,	map = require('map-stream')
,	add = require('gulp-add')
,	gif = require('gulp-if')
,	async = require('async')
,	args   = require('yargs').argv
,	glob = require('glob');

var dest = path.join(process.gulp_dest, 'javascript');

var isSCIS = !package_manager.distro.isSCA && !package_manager.distro.isSCLite;

var almondNSPackage = 'almond'
var almondNSPackageSection = 'javascript'
if(args.instrumentBc){
	almondNSPackage = 'ViewContextDumper'
	almondNSPackageSection = 'instrumented-javascript'
}

function getGlobs()
{
	return _.union(
		[path.join(process.gulp_dest, 'processed-templates', '*.js')]
	,	package_manager.getGlobsFor('javascript')
	,	[path.join(process.gulp_dest, 'javascript-dependencies', '*.js')]
	,	package_manager.getGlobsFor('unit-test-files')
	);
}

// templateManifests
// In SCLite we don't have javascript and so we are not able to calculate the templates dependencies for an application.
// Then we generate templates manifests for each application so another task is able to compile them.
function templateManifests(config)
{
	var files = [];
	var onFile = function(file)
	{
		var fileIsTemplate = file.path.match(/\.tpl\.js$/) ||
			path.basename(file.path).indexOf('handlebars.runtime') === 0 ||
			path.basename(file.path).indexOf('Handlebars.CompilerNameLookup') === 0;

		if (!fileIsTemplate)
		{
			this.emit('data', file);
		}
		else if (file.path.match(/\.tpl\.js$/))
		{
			files.push(path.basename(file.path));
		}
	};

	var onEnd = function()
	{
		var manifestName = 'templates-manifest-' + path.basename(config.exportFile, '.js') + '.json';
		fs.writeFileSync(manifestName, JSON.stringify(files, null, 2));

		this.emit('end');
	};

	return through(onFile, onEnd);
}

var instrumentVinylFile = require('./istanbul-instrument').instrumentVinylFile;


// generates a bootstrapper script that requires the starter script using require.js
function generateStarterLocalFiles(config)
{
	var paths = {}
    ,   unit_test_paths = []
	,	rawTemplates = {};

	var onFile = function(file)
	{
		var normalized_path = path.resolve(file.path)
		,	moduleName = path.basename(normalized_path, '.js')
		,	override_info = package_manager.getOverrideInfo(normalized_path);

		if (override_info.isOverriden)
		{
			normalized_path = override_info.overridePath;
		}

		var relativePath = normalized_path.replace(/\\/g,'/').replace(/\.js$/, '');
		paths[moduleName] = relativePath;

        if(package_manager.isGulpUnitTest && moduleName.indexOf('UnitTest') !== -1)
        {
            unit_test_paths.push(moduleName);
        }

		if (file.contents)
		{
			var contents = file.contents.toString()
			,	regex = /(\w+\.tpl)/g
			,	match = regex.exec(contents)
			,	template;

			while (match)
			{
				template = match[0];
				rawTemplates[template] = true;

				match = regex.exec(contents);
			}
		}
	};

	var fixPaths = function()
	{
		_.each(config.amdConfig.paths, function(renamedModuleName, originalModuleName)
		{
			paths[originalModuleName] = paths[renamedModuleName];
		});
	};

	var onEnd = function()
	{
		fixPaths();

		config.amdConfig.rawText = config.amdConfig.rawText || {};

		_.each(rawTemplates, function(value, fileName)
		{
			if (!paths[fileName])
			{
				config.amdConfig.rawText[fileName] = '';
			}
		});

        config.unit_tests = unit_test_paths;
		var	starter_content = generateEntryPointContent(config);

		var file = new File({
			path: config.exportFile
		,	contents: new Buffer('')
		});

		config.amdConfig.paths = paths;
		config.amdConfig.rawText[path.basename(config.exportFile, '.js')] = starter_content;

		this.emit('data', file);
		this.emit('end');
	};

	return through(onFile, onEnd);
}

module.exports = {
	generateStarterLocalFiles: generateStarterLocalFiles
};

function generateEntryPointContent(config)
{
	var entry_point = [config.entryPoint]
    ,   unit_tests = config.unit_tests || []
    ,   test_tpl = unit_tests.length ? 'require(<%= unit_tests %>);\n': '';

    var template = _.template('try {\nrequire.config(<%= require_config %>);\n' + test_tpl + 'var ' + entry_point[0].replace(/\./g,'') + '= true;\n}\ncatch(e){};');

	if (!config.is_extensible)
	{
		entry_point.unshift('almond');
	}

	var	starter_content = template({
		require_config: JSON.stringify(config.amdConfig, null, '\t')
	,	entry_point: JSON.stringify(entry_point)
	,	unit_tests: JSON.stringify(unit_tests)
	});

	return starter_content;
}

function compileSCA(config, cb, generateTemplateManifests)
{
	var templates = {}
	,	entrypoint_content = generateEntryPointContent(config);

	config.amdConfig.onBuildRead = function (moduleName, pathName, contents)
	{
		if (generateTemplateManifests)
		{
			var fileIsTemplate = pathName.match(/\.tpl\.js$/) ||
				moduleName.indexOf('handlebars.runtime') === 0 ||
				moduleName.indexOf('Handlebars.CompilerNameLookup') === 0;

			if (!fileIsTemplate)
			{
				return contents;
			}
			else if (pathName.match(/\.tpl\.js$/))
			{
				templates[path.basename(pathName)] = true;
				return '';
			}

			return '';
		}

		return contents;
    };

	config.amdConfig.onModuleBundleComplete = function(data)
	{
		if (generateTemplateManifests)
		{
			var manifestName = 'templates-manifest-' + path.basename(config.exportFile, '.js') + '.json';

			_.each(process.dataTemplateDependencies, function(moduleViews)
			{
				_.each(moduleViews, function(view)
				{
					templates[view + '.tpl.js'] = true;
				});
			});

			fs.writeFileSync(manifestName, JSON.stringify(_.keys(templates), null, 2));
		}
	};

	config.amdConfig.onBuildWrite = function (moduleName, pathName, contents)
	{
		if (path.basename(config.exportFile, '.js') === moduleName)
		{
			return entrypoint_content;
		}
		else
		{
			return contents;
		}
	};

	requireJSCopy();

	if (!args.nouglify && !package_manager.isGulpLocal)
	{
		config.amdConfig.optimize = 'uglify';
		config.amdConfig.uglify = { output: { comments: 'some' }};
	}
	else
	{
		config.amdConfig.optimize = 'none';
	}

	config.amdConfig.generateSourceMaps = true;
	config.amdConfig.skipModuleInsertion = false;
	config.amdConfig.wrapShim = true;
	config.amdConfig.preserveLicenseComments = false;
	config.amdConfig.rawText = {};
	config.amdConfig.deps = [config.entryPoint];

	var license_paths = glob.sync(path.join(process.cwd(), 'Modules', '**/*.license'))
	,	licenses_content = '';

	_.each(license_paths, function(license_path)
	{
		licenses_content += fs.readFileSync(license_path, { 'encoding': 'utf8' }) + '\n';
	});
	
	var paths = {};
	var stream = gulp.src(getGlobs())
		.pipe(package_manager.handleOverrides())
		.pipe(gif(args.instrumentFrontend, instrumentVinylFile({coverageServer: args.coverageServer})))
		.pipe(generateStarterLocalFiles(config))
		.pipe(sourcemaps.init())
		.pipe(amdOptimize(config.amdConfig))
		.pipe(map(function (file, cb)
		{
			file.contents = new Buffer(file.contents.toString() + '\n' + licenses_content);
			cb(null, file);
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest), { mode: '0777' })
		.on('end', cb);
}

function compileTemplates(config, cb)
{
	// @function getAMDIndexFile builds an index file that depends on all given files - to be used as amdoptimize's index
	// @return {index:String,content:String} @param {Array} requiredFiles @param config
	function getAMDIndexFile(requiredFiles, config)
	{
		var requiredModules = _.map(requiredFiles, function(f){return path.basename(f, '.js');});
		var indexName = 'SCLite_' + path.basename(config.exportFile, '.js') + '_templates';
		var counter = 0;

		var indexContent =
			'define(\''+indexName+'\', [' +
			_.map(requiredModules, function(m){if(m.indexOf('handlebars.runtime') === 0){return '\'Handlebars\''; }return '\'' + m + '\''; }).join(', ') +
			'], function(' +
			_.map(requiredModules, function(){counter++;return 'a'+counter;}).join(', ') +
			'){});';

		return {name: indexName, content: indexContent};
	}

	function getOnlyTemplatesGlobs(config)
	{
		var shell = require('shelljs')
		,	glob = require('glob').sync
		var appName = path.basename(config.exportFile, '.js');
		var templateManifest = 'templates-manifest-' + appName + '.json';
		if(!shell.test('-f', templateManifest))
		{
			return [];
		}
		templateManifest = JSON.parse(shell.cat(templateManifest));

		var templatesToAdd = {};

		var templates = _.map(templateManifest, function(templateFile)
		{
			var parentTemplate = path.basename(templateFile, '.tpl.js');
			templatesToAdd = _.extend(templatesToAdd, process.dataTemplateDependencies[parentTemplate] || {});
			return path.join(process.gulp_dest, 'processed-templates', templateFile);
		});
		templates = _.union(templates, _.map(templatesToAdd, function(t)
		{
			return path.join(process.gulp_dest, 'processed-templates', t+'.tpl.js');
		}));

		// we will recreate another override map to be more performant
		if(!package_manager.overrides.mapLocal)
		{
			package_manager.overrides.mapLocal = {};
			_.each(package_manager.overrides.map, function(val, key)
			{
				var p = path.join(process.gulp_dest, 'processed-templates', path.basename(key) + '.js');
				package_manager.overrides.mapLocal[p] = val;
			});
		}
		var files = _.union(
			[path.join(process.gulp_dest, 'javascript-libs.js')]
		,	templates
		);
		return files;
	}

	var requiredFiles = getOnlyTemplatesGlobs(config);
	var indexFile = getAMDIndexFile(requiredFiles, config);
	var outputFile = path.basename(config.exportFile, '.js') + '-templates' + '.js';
	var doUglify = !args.nouglify && !package_manager.isGulpLocal;
	//var amdOptimizeConfig = _.extend(config.amdConfig, {preserveFiles:false, preserveComments:true});

	gulp.src(requiredFiles)
		.pipe(add(indexFile.name + '.js', indexFile.content))
		//.pipe(amdOptimize(amdOptimizeConfig)).on('error', package_manager.pipeErrorHandler)
		.pipe(gif(args.instrumentFrontend, instrumentVinylFile({coverageServer: args.coverageServer})))
		.pipe(concat(outputFile))
		.pipe(gif(doUglify, uglify({output: {comments: 'some'}}))).on('error', package_manager.pipeErrorHandler)
		.pipe(gulp.dest(path.join(package_manager.getNonManageResourcesPath()), { mode: '0777' }))
		.on('end', cb);
}

function cloneJson(json)
{
	return JSON.parse(JSON.stringify(json));
}

function processJavascript(cb)
{
	var configs = package_manager.getTaskConfig('javascript', []);

	configs = _.isArray(configs) ? configs : [configs];
	async.each(
		configs
	,	function(config, cb)
		{
			var applications = package_manager.distro.app_manifest.application || []
            ,   export_file = config.exportFile.replace(/\.js$/, '');

            config.is_extensible = _.contains(applications, export_file);

            if(config.is_extensible)
            {
                compileSCA(
                    cloneJson(config)
                , 	function(){
                        if(!process.is_SCA_devTools)
                        {
                            compileTemplates(cloneJson(config), cb);
                        }
                        else
                        {
                            cb();
                        }
                    }
                ,	!process.is_SCA_devTools
                );
            }
			else
			{
				compileSCA(cloneJson(config), cb, false);
			}

		}
	,	function()
		{
			cb();
		}
	);
}

function requireJSCopy()
{
	return gulp.src(package_manager.getGlobsForModule('require.js', 'javascript'))
		.pipe(gulp.dest(dest, { mode: '0777' }));
}

function ensureFolder(name)
{
	try
	{
		fs.mkdirSync(name);
	}
	catch(ex)
	{

	}
}

gulp.task('javascript-entrypoints', [], function()
{
	var configs = package_manager.getTaskConfig('javascript', []);
	ensureFolder(process.gulp_dest);
	ensureFolder(path.join(process.gulp_dest, 'javascript-dependencies'));
	_(configs).each(function(config)
	{
		var contentPrefix = ''
		if(args.instrumentBc)
		{
			if(!_.contains(config.dependencies, 'ViewContextDumper'))
			{
				config.dependencies.push('ViewContextDumper');
			}

			contentPrefix = '\nINTRUMENT_BC_ARGUMENT = "' + args.instrumentBc + '";\n' +
				(args.instrumentationServer ? ('INTRUMENT_BC_SERVER = "' + args.instrumentationServer + '";\n') : '')
		}

		var dependenciesModuleName = config.entryPoint + '.Dependencies';
		var fn_params = []; //we must pass the arguments because an amdclean issue
		for (var i = 0; i < _(config.dependencies).keys().length; i++) { fn_params.push('a'+i); }
		var content = contentPrefix + 'define(\''+dependenciesModuleName+'\', ' + JSON.stringify(config.dependencies) + ', function('+fn_params.join(',')+'){ return Array.prototype.slice.call(arguments); }); ';

		fs.writeFileSync(path.join(process.gulp_dest, 'javascript-dependencies', dependenciesModuleName+'.js'), content);
	});
});

gulp.task('backward-compatibility-amd-unclean', [], function(cb)
{
	var outputFile = 'backward-compatibility-amd-unclean.js'
	,	glob = require('glob').sync
	,	map = require('map-stream')
	,	doUglify = !args.nouglify && !package_manager.isGulpLocal
	,	files = _.union(
			_.flatten(_.map(package_manager.getGlobsForModule(almondNSPackage, almondNSPackageSection), function(g){return glob(g);}))
		,	_.flatten(_.map(package_manager.getGlobsForModule('SC.Extensions', 'javascript-almond-fix'), function(g){return glob(g);}))
		,	_.flatten(_.map(package_manager.getGlobsFor('javascript-ext'), function(g){return glob(g);}))
	);

	gulp.src(files)
		.pipe(map(function(file, cb)
		{
			if(path.basename(file.path, '.js') === 'almond' || path.basename(file.path, '.js') === 'LoadTemplateSafe')
			{
				var file_content = '';
				if(path.basename(file.path, '.js') === 'almond')
				{
					file_content += 'var was_undefined = (typeof define === \'undefined\');\n';
				}
				file_content += 'if(was_undefined)\n{\n';
				file_content += file.contents.toString();
				file_content += '\n}\n';

				file.contents = new Buffer(file_content);
			}
			cb(null, file);
		}))
		.pipe(concat(outputFile))
		.pipe(gif(doUglify, uglify({output: {comments: 'some'}}))).on('error', package_manager.pipeErrorHandler)
		.pipe(gulp.dest(path.join(process.gulp_dest), { mode: '0777' }))
		.on('end', cb);
});

gulp.task('libs', ['backward-compatibility-amd-unclean'], function(cb)
{
	function getAMDIndexFile(requiredFiles)
	{
		var requiredModules = _.map(requiredFiles, function(f){return path.basename(f);});
		var indexName = 'index-javascript-lib';
		var counter = 0;

		var indexContent =
			'define(\''+indexName+'\', [' +
			_.map(requiredModules, function(m){if(m.indexOf('handlebars.runtime') === 0){return '\'Handlebars\''; }return '\'' + m + '\''; }).join(', ') +
			'], function(' +
			_.map(requiredModules, function(){counter++;return 'a'+counter;}).join(', ') +
			'){});';

		return {name: indexName, content: indexContent};
	}

	function getPathFile(moduleName, folderName, fileName)
	{
		var file = _.flatten(_.map(package_manager.getGlobsForModule(moduleName, folderName), function(g)
		{
			if (fileName)
			{
				return [_.find(glob(g), function(f)
				{
					return f.indexOf(fileName) !== -1;
				})];
			}
			else
			{
				return glob(g);
			}
		}))[0] || '';

		return file.replace('.js', '');
	}

	var	glob = require('glob').sync
	,	outputFile = 'javascript-libs.js'
	,	doUglify = !args.nouglify && !package_manager.isGulpLocal
	,	files = {
			'almond': getPathFile(almondNSPackage, almondNSPackageSection)
		,	'LoadTemplateSafe': getPathFile('SC.Extensions', 'javascript-almond-fix')
		,	'Handlebars': getPathFile('handlebars', 'javascript')
		,	'Handlebars.CompilerNameLookup': getPathFile('HandlebarsExtras', 'javascript', 'Handlebars.CompilerNameLookup.js')
		}
	,	indexFile = getAMDIndexFile(_.values(files))
	,	amdOptimizeConfig = {
			paths: files
		,	preserveLicenseComments: true
		,	optimize: 'none'
		,	rawText: {}
		};

		amdOptimizeConfig.rawText[indexFile.name] = indexFile.content;

	gulp.src([])
		.pipe(add(indexFile.name + '.js', ''))
		.pipe(amdOptimize(amdOptimizeConfig)).on('error', package_manager.pipeErrorHandler)
		.pipe(concat(outputFile))
		.pipe(gif(doUglify, uglify({output: {comments: 'some'}}))).on('error', package_manager.pipeErrorHandler)
		.pipe(gulp.dest(path.join(process.gulp_dest), { mode: '0777' }))
		.on('end', cb);
});

var js_deps = ['javascript-entrypoints'];

!process.is_SCA_devTools && js_deps.splice(0, 0, 'templates');

js_deps.push('libs');

gulp.task('javascript', js_deps, processJavascript);
gulp.task('javascript-no-deps', processJavascript);

var js_watch_deps = !process.is_SCA_devTools ? ['watch-templates'] : [];

gulp.task('watch-javascript', js_watch_deps, function()
{
	if(package_manager.distro.isSCLite)
	{
		gulp.watch(path.join(process.gulp_dest, 'processed-templates/*'), ['javascript-no-deps'], 1000);
	}
	else
	{
		gulp.watch(package_manager.getGlobsFor('javascript'), ['javascript-no-deps'], 1000);
	}
});
