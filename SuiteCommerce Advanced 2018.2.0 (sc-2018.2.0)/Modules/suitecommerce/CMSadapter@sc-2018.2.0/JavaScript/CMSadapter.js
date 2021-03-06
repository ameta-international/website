/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
// @module CMSadapter
define('CMSadapter'
,	[	'Backbone'
	,	'CMSadapter.Page.Router'
	,	'CMSadapter.Page.Collection'
	,	'CMSadapter.Impl.Enhanced'
	,	'CMSadapter.Component'
	,	'SC.Configuration'

	,	'jQuery'
	]
,	function (
		Backbone
	,	CMSadapterPagePageRouter
	,	CMSadapterPagePageCollection
	,	CMSadapterImplEnhanced
	,	CMSadapterComponent
	,	Configuration

	,	jQuery
	)
{
	'use strict';

	// @class CMSadapter responsible of starting both the adapter implementation and cms landing pages router.
	// Assumes cms.js is already loaded
	// @extend ApplicationModule
	return {

		mountAdapter: function (application)
		{
			if (Configuration.get('cms.useCMS'))
			{		
				application.registerComponent(CMSadapterComponent(application));

				var router = this.initPageRouter(application)
				,	self = this;

				// instantiate and expose it:
				if (typeof CMS === 'undefined' || !CMS.on)
				{
					Backbone.Events.on('cms:load', function ()
					{
						self.initAdapter(application, router);
	 				});
				}
				else
				{
					this.initAdapter(application, router);
				}

				this.adapterEnhanced = new CMSadapterImplEnhanced(application, router);

				this.installBackboneViewPlugins(application);

				application.getLayout().once('afterAppendView', jQuery.proxy(self, 'loadScript', application, router))
			}

			return this.postMountAdapter(application);
		}

	,	loadScript: function loadScript(application, router)
		{
			var self = this;

			jQuery.getScript('/cms/' + Configuration.get('cms.adapterVersion') + '/cms.js')
				.done(function()
				{
					self.initAdapter(application, router);
				});
		}

	,	initAdapter: function initAdapter(application, landingRouter)
		{
			if (typeof CMS === 'undefined')
			{
				return;
			}

			this.initAdapterImpls(application, CMS, landingRouter);
		}

		// @method initPageRouter instantiate the landing pages router using bootstrapped data.
	,	initPageRouter: function initPageRouter(application)
		{
			if (!SC.ENVIRONMENT.CMS || !SC.ENVIRONMENT.CMS.pages)
			{
				return;
			}

			var collection = new CMSadapterPagePageCollection(SC.ENVIRONMENT.CMS.pages.pages || []);

			return new CMSadapterPagePageRouter(application, collection);
		}

	,	installBackboneViewPlugins: jQuery.noop

	,	initAdapterImpls: jQuery.noop

	,	postMountAdapter: jQuery.noop
	};
});
