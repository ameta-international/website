define('RestrictParentCompanyUpdate.Helper.Checkout', [
    'Backbone.CompositeView',
    'Profile.Model',

    'Address.Details.View',
    'CreditCard.View',

    'underscore',
    'jQuery'
], function RestrictParentCompanyUpdateHelper(
    BackboneCompositeView,
    ProfileModel,

    AddressDetailsView,
    CreditCardView,

    _,
    jQuery
) {
    'use strict';

    var Helper = {
        _restrictAddressUpdate: function restrictAddressUpdate() {
            AddressDetailsView.prototype.initialize = _.wrap(AddressDetailsView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    if (this.model.get('defaultbilling') === 'T' || this.model.get('defaultshipping') === 'T') {
                        this.$('.address-details-container[data-id="'+ this.model.get('internalid') +'"] .address-details-actions').remove();
                    }
                });
            });
        },

        _restrictCreditCardUpdate: function restrictCreditCardUpdate() {
            CreditCardView.prototype.initialize = _.wrap(CreditCardView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                var self = this;

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    _.defer(function() {
                        if (self.model.get('ccdefault') === 'T') {
                            jQuery('.order-wizard-paymentmethod-creditcard-module-actions .order-wizard-paymentmethod-creditcard-module-edit-card').remove();
                        }
                    });
                });
            });
        },

        restrictContact: function restrictContact() {
            // restrict update address update
            this._restrictAddressUpdate();

            // restrict update credit card
            this._restrictCreditCardUpdate();
        }
    };

    return Helper;
});
