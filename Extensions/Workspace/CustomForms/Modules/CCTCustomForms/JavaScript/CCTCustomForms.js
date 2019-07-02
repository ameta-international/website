define('CCTCustomForms', [
    'CCTCustomForms.View'
], function CCTCustomForms(
    CCTCustomFormsView
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var component = application.getComponent('CMS');

            if (!component) {
                return;
            }

            component.registerCustomContentType({
                id: 'CMS_CUSTOM_FORM',
                view: CCTCustomFormsView
            });
        }
    };
});
