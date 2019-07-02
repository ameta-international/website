define('PS.ShippingCustomization.ShippingCustomization', [
    'ShippingCustomization.Helper'
], function PSShippingCustomizationShippingCustomization(
    ShippingCustomizationHelper
) {
    'use strict';

    return {
        mountToApp: function mountToApp(container) {
            container.getLayout().on('afterAppendView', function afterAppendView(view) {
                ShippingCustomizationHelper.hideShippingCharges(view);
            });
        }
    };
});
