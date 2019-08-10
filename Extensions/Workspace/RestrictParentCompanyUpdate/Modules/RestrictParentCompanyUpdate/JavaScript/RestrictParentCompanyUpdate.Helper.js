define('RestrictParentCompanyUpdate.Helper', [
    'Backbone.CompositeView',
    'Profile.Model',
    'Profile.Information.View',
    'Profile.Information.Contact.View',

    'Overview.Shipping.View',
    'Overview.Payment.View',

    'Address.Details.View',
    'Address.Edit.Fields.View',

    'CreditCard.View',
    'CreditCard.Edit.Form.View',

    'profile_information.tpl',

    'underscore'
], function RestrictParentCompanyUpdateHelper(
    BackboneCompositeView,
    ProfileModel,
    ProfileInformationView,
    ProfileInformationContactView,

    OverviewShippingView,
    OverviewPaymentView,

    AddressDetailsView,
    AddressEditFieldsView,

    CreditCardView,
    CreditCardEditFormView,

    profileTemplate,

    _
) {
    'use strict';

    var Helper = {
        _restrictProfileUpdate: function restrictProfileUpdate(profileModel) {
            ProfileInformationView.prototype.childViews = _.extend({}, ProfileInformationView.prototype.childViews, {
                'Profile.Information.Contact': function childViewGoogleCaptcha() {
                    return new ProfileInformationContactView({
                        application: this.application,
                        profileModel: profileModel
                    });
                }
            });

            ProfileInformationView.prototype.initialize = _.wrap(ProfileInformationView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                if (!ProfileInformationView.prototype.childViews) {
                    ProfileInformationView.prototype.childViews = {};
                    BackboneCompositeView.add(this);
                }

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    this.$el.find('.profile-information form')
                        .after('<div class="profile-information-contact" ' +
                            'data-view="Profile.Information.Contact">' +
                            '</div>');
                });
            });
        },

        _restrictAddressUpdate: function restrictAddressUpdate() {
            OverviewShippingView.prototype.initialize = _.wrap(OverviewShippingView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                if (this.model.get('defaultbilling') === 'T' || this.model.get('defaultshipping') === 'T') {
                    this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                        this.$('.overview-shipping-card-button-edit').remove();
                    });
                }
            });

            AddressDetailsView.prototype.initialize = _.wrap(AddressDetailsView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    if (this.model.get('defaultbilling') === 'T' || this.model.get('defaultshipping') === 'T') {
                        this.$('.address-details-container[data-id="'+ this.model.get('internalid') +'"] .address-details-actions').remove();
                    }
                });
            });

            AddressEditFieldsView.prototype.initialize = _.wrap(AddressEditFieldsView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    this.$('.address-edit-fields-group[data-input="defaultbilling"]').remove();
                    this.$('.address-edit-fields-group[data-input="defaultshipping"]').remove();
                });
            });
        },

        _restrictCreditCardUpdate: function restrictCreditCardUpdate() {
            OverviewPaymentView.prototype.initialize = _.wrap(OverviewPaymentView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    if (this.model.get('ccdefault') === 'T') {
                        this.$('.overview-payment-card-button-edit').remove();
                    }
                });
            });

            CreditCardView.prototype.initialize = _.wrap(CreditCardView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    if (this.model.get('ccdefault') === 'T') {
                        this.$('.creditcard[data-id="'+ this.model.get('internalid') +'"] .creditcard-actions').remove();
                    }
                });
            });

            CreditCardEditFormView.prototype.getContext = _.wrap(CreditCardView.prototype.getContext, function getContext(fn) {
                var context = fn.apply(this, _.toArray(arguments).slice(1));

                context.showDefaults = false;

                return context;
            });
        },

        restrictContact: function restrictContact() {
            var profileModel = ProfileModel.getInstance();

            // restrict update profile information
            this._restrictProfileUpdate(profileModel);

            // restrict update address update
            this._restrictAddressUpdate();

            // restrict update credit card
            this._restrictCreditCardUpdate();
        }
    };

    return Helper;
});
