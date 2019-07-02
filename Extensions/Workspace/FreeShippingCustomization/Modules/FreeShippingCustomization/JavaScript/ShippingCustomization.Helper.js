define('ShippingCustomization.Helper', [
    'jQuery',
    'underscore'
],
function ShippingCustomizationHelper(
    jQuery,
    _
) {
    'use strict';

    var isFreeShipping = function isFreeShipping(shipCost) {
        return !shipCost || (/Free/i.test(shipCost)) || (Number(/[0-9]+[.0-9]*/.test(shipCost) && /[0-9]+[.0-9]*/.exec(shipCost)[0]) === 0);
    };

    var hideShippingChargesFromView = function hideShippingChargesFromView(view) {
        var $shippingMethodsRadioButtons = view.$('.order-wizard-shipmethod-module-option-price');
        var $shippingMethodsDropdowm = view.$('[data-action="select-delivery-option"], [data-action="change-delivery-options"]').find('option');
        var $shippingCostSummary = view.$('.order-wizard-cart-summary-shipping-cost-formatted');
        var shippingMessage = _('Calculated at Time of Fulfillment').translate();
        var shipCostSummary;

        $shippingMethodsRadioButtons.each(function eachShippingMethod(index, element) {
            var $element = jQuery(element);
            var shipCost = jQuery.trim($element.text());

            if (isFreeShipping(shipCost)) {
                $element.text('');
            }
        });

        $shippingMethodsDropdowm.each(function eachShippingMethod(index, element) {
            var $element = jQuery(element);
            var text = jQuery.trim($element.text());
            var dashIndex = text.indexOf('-');
            var shipCost;
            var shipName;

            if (dashIndex !== -1) {
                shipCost = jQuery.trim(text.substr(0, dashIndex));
                if (isFreeShipping(shipCost)) {
                    shipName = jQuery.trim(text.substr(dashIndex + 1));
                    $element.text(shipName);
                }
            }
        });

        shipCostSummary = jQuery.trim($shippingCostSummary.text());
        if (isFreeShipping(shipCostSummary)) {
            $shippingCostSummary.text(shippingMessage);
        }
    };

    return {
        hideShippingCharges: function hideShippingCharges(view) {
            var self = this;
            var currentStep;
            var shipModule;

            hideShippingChargesFromView(view);
            if (view && view.wizard && view.wizard.getCurrentStep && view.wizard.getCurrentStep()) {
                currentStep = view.wizard.getCurrentStep();
                if (currentStep.moduleInstances) {
                    shipModule = _(currentStep.moduleInstances).findWhere({ module_id: 'order_wizard_shipmethod_module' });
                    if (shipModule) {
                        shipModule.on('afterViewRender', function afterViewRender() {
                            hideShippingChargesFromView(currentStep);
                        });
                    } else {
                        shipModule = _(currentStep.moduleInstances).findWhere({ module_id: 'order_wizard_showshipments_module' });
                        if (shipModule) {
                            shipModule.on('afterViewRender', function afterViewRender() {
                                hideShippingChargesFromView(currentStep);
                            });
                        }
                    }
                }
            }
        }
    };
});
