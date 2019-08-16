define('RestrictParentCompanyUpdate', [
    'RestrictParentCompanyUpdate.Helper',
    'Profile.Model'
], function RestrictParentCompanyUpdate(
    Helper,
    ProfileModel
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var profileModel = ProfileModel.getInstance();
            var layout = application.getComponent('Layout');

            if (layout) {
                Helper.restrictContact();
            }
        }
    };
});
