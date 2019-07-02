/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Profile
// This file define the functions to be used on profile service
define(
	'Profile.Model.Fix'
,	[
		'Profile.Model'
	,	'SC.Model'
	,	'SC.Models.Init'
	,	'Utils'
	,	'underscore'

	]
,	function (
		ProfileModel,
		SCModel
	,	ModelsInit
	,	Utils
	,	_
	)
{
	'use strict';

	_.extend(ProfileModel, {
		update: function (data)
			{
				var login = nlapiGetLogin();

				nlapiLogExecution("debug", "update");

				if (data.current_password && data.password && data.password === data.confirm_password)
				{
					//Updating password
					return login.changePassword(data.current_password, data.password);
				}

				this.currentSettings = ModelsInit.customer.getFieldValues();

				//Define the customer to be updated

				var customerUpdate = {
					internalid: parseInt(nlapiGetUser(), 10)
				};

				//Assign the values to the customer to be updated

				customerUpdate.firstname = data.firstname;

				if(data.lastname !== '')
				{
					customerUpdate.lastname = data.lastname;
				}

				if(this.currentSettings.lastname === data.lastname)
				{
					delete this.validation.lastname;
				}

				customerUpdate.companyname = data.companyname;


				customerUpdate.phoneinfo = {
						altphone: data.altphone
					,	phone: data.phone
					,	fax: data.fax
				};

				if(data.phone !== '')
				{
					customerUpdate.phone = data.phone;
				}

				if(this.currentSettings.phone === data.phone)
				{
					delete this.validation.phone;
				}

				nlapiLogExecution("debug", "emailsubscribe", data.emailsubscribe);

				customerUpdate.emailsubscribe = (data.emailsubscribe && data.emailsubscribe !== 'F') ? 'T' : 'F';

				if (!(this.currentSettings.companyname === '' || this.currentSettings.isperson || ModelsInit.session.getSiteSettings(['registration']).registration.companyfieldmandatory !== 'T'))
				{
					this.validation.companyname = {required: true, msg: 'Company Name is required'};
				}

				if (!this.currentSettings.isperson)
				{
					delete this.validation.firstname;
					delete this.validation.lastname;
				}

				//Updating customer data
				if (data.email && data.email !== this.currentSettings.email && data.email === data.confirm_email && data.isGuest === 'T')
					{
						customerUpdate.email = data.email;
					}
				else if (data.new_email && data.new_email === data.confirm_email && data.new_email !== this.currentSettings.email)
					{
					ModelsInit.session.login({
						email: data.email
					,	password: data.current_password
					});
					login.changeEmail(data.current_password, data.new_email, true);
				}

				// Patch to make the updateProfile call work when the user is not updating the email
				data.confirm_email = data.email;

				this.validate(data);
				// check if this throws error

				nlapiLogExecution("debug", "customerupdate", JSON.stringify(customerUpdate));
				ModelsInit.customer.updateProfile(customerUpdate);

				if (data.campaignsubscriptions)
				{
					ModelsInit.customer.updateCampaignSubscriptions(data.campaignsubscriptions);
				}

				nlapiLogExecution("debug", "done");
				return this.get();
			}
	});
});
