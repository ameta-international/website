define('Profile.Information.Contact.View', [
    'Backbone',
    'SC.Configuration',
    'Profile.Information.View',
    'profile_contact_information.tpl',
    'underscore',
    'jQuery'
], function ProfileInformationContactView(
    Backbone,
    Configuration,
    ProfileInformationView,
    template,
    _,
    jQuery
) {
    'use strict';

    return Backbone.View.extend({
        template: template,

        initialize: function initialize() {
            _.defer(function() {
                jQuery('.profile-information form').remove();
                jQuery('.profile-information .profile-information-contact').show();
            });
        },

        getContext: function getContext() {
            return {
                isNotCompany: this.options.profileModel.get('type') !== 'COMPANY',
                firstName: this.options.profileModel.get('firstname') || '',
                lastName: this.options.profileModel.get('lastname') || '',
                companyName: this.options.profileModel.get('companyname') || '',
                email: this.options.profileModel.get('email') || '',
                phone: this.options.profileModel.get('phone') || '',
                isCompanyAndShowCompanyField: this.options.profileModel.get('type') === 'COMPANY' || Configuration.get('siteSettings.registration.showcompanyfield') === 'T'
            };
        }
    });
});
