define('Facets.Browse.View.Site', [
    'Facets.Browse.View',
    'underscore'
], function (
    View,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        getTitle: _.wrap(View.prototype.getTitle, function (fn, options) {

            var domainSuffix = this.options.application.getConfig('domainSuffix');
            var pageTitleSuffix = (domainSuffix) ? domainSuffix : '';
            var suffixValidation = fn.apply(this, _.toArray(arguments).slice(1));

            return suffixValidation.indexOf(pageTitleSuffix) == -1 ? fn.apply(this, _.toArray(arguments).slice(1)) + ' ' + pageTitleSuffix : fn.apply(this, _.toArray(arguments).slice(1));
        })
    });
});

