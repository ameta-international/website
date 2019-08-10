define('RestrictParentCompanyUpdate.Checkout', [
    'RestrictParentCompanyUpdate.Helper.Checkout',
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
                if (profileModel.get('isContact')) {
                    Helper.restrictContact();
                }
            }
        }
    };
});
