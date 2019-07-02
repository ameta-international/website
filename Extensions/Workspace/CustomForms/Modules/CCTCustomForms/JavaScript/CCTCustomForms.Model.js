define('CCTCustomForms.Model', [
    'Backbone',
    'Utils'
],
function CCTCustomFormsModel(
    Backbone,
    Utils
) {
    'use strict';

    /* global getExtensionAssetsPath */

    return Backbone.Model.extend({
        url: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/CCTCustomForms.Service.ss'))
    });
});
