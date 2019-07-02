define('Backbone.View.Site', [
    'Backbone.View',
    'underscore'
], function (
    View,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        getTitle: _.wrap(View.prototype.getTitle, _.once(function (fn, options) { //Using once to call the method only once for PDP, by default it executes twice on PDP.
            var domainSuffix = this.options.application.getConfig('domainSuffix');
            var pageTitleSuffix = (domainSuffix) ? domainSuffix : '';
            return fn.apply(this, _.toArray(arguments).slice(1)) + ' ' + pageTitleSuffix;
        }))
    });
});