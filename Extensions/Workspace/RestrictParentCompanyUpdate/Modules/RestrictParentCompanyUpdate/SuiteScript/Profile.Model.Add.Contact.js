define('Profile.Model.Add.Contact', [
    'Profile.Model',
    'SC.Models.Init',
    'underscore'
], function ProfileModelAddContact(
    ProfileModel,
    ModelsInit,
    _
) {
    'use strict';

    _.extend(ProfileModel, {
        get: _.wrap(ProfileModel.get, function wrap(fn) {
            var params = _.toArray(arguments).slice(1);
            var profile = fn.apply(this, params) || {};

            profile.isContact = ModelsInit.customer.getFieldValues().contactloginid !== '0';

            return profile;
        })
    });
});
