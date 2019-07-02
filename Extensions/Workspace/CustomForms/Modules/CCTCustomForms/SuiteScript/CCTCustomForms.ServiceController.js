define('PS.CustomForms.CCTCustomForms.ServiceController', [
    'ServiceController',
    'SC.Models.Init',
    'PS.CustomForms.CCTCustomForms.Model'
], function PSCustomFormsCCTCustomFormsServiceController(
    ServiceController,
    ModelsInit,
    CCTCustomFormsModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'PS.CustomForms.CCTCustomForms.ServiceController',

        // The values in this object are the validation needed for the current service.
        // Can have values for all the request methods ('common' values) and specific for each one.
        options: {
            common: {
                requireLoggedInPPS: true
            }
        },

        get: function get() {
            // do nothing
        },

        post: function post() {
            return CCTCustomFormsModel.create(this.data);
        },

        put: function put() {
            // do nothing
        },

        'delete': function del() {
            // do nothing
        }
    });
});
