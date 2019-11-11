
define(
	'ACS.KeepDefaultsExtension.KeepDefaultsExtension'
	, [
		'Application',
		'SC.Models.Init',
		'underscore'
	]
	, function AddressModelSetDefault(
		Application,
		ModelsInit,
		_
	) {
		'use strict';

		Application.on('after:Address.update', function AddressUpdate(Model, result, id, data) {
			data.internalid = id;
			updateProfileAddressAndCreditCard(data);
			return result;
		});

		Application.on('after:Address.create', function AddressCreate(Model, result, data) {
			data.internalid = result;
			updateProfileAddressAndCreditCard(data);
			return result;
		});

		Application.on('after:CreditCard.create', function CreditCardCreate(Model, result, data) {
			data.ccinternalid = result;
			updateProfileAddressAndCreditCard(data);
			return result;
		});

		Application.on('after:CreditCard.update', function CreditCardUpdate(Model, result, id, data) {
			data.ccinternalid = id;
			updateProfileAddressAndCreditCard(data);
			return result;
		});

		/**
		 * set the defualt shipping address field for the customer
		 * @param {Address.Data.Model} data
		 */
		function updateProfileAddressAndCreditCard(data) {
			var customerUpdated = false;
			var customerUpdate = {
				internalid: parseInt(nlapiGetUser(), 10),
				customfields: {}
			};

			nlapiLogExecution('DEBUG','KeepDefaultsExtension data', JSON.stringify(data));
			if (data.defaultshipping === 'T') {
				customerUpdate.customfields = _.extend(customerUpdate.customfields, {
					'custentity_cs_default_shipaddress': data.internalid
				});
				customerUpdated = true;
			}
			if (data.defaultbilling === 'T') {
				customerUpdate.customfields = _.extend(customerUpdate.customfields, {
					'custentity_cs_default_billaddress': data.internalid
				});
				customerUpdated = true;
			}
			if (data.ccdefault === 'T') {
				customerUpdate.customfields = _.extend(customerUpdate.customfields, {
					'custentity_cs_default_creditcard': data.ccinternalid
				});
				customerUpdated = true;
			}
			nlapiLogExecution('DEBUG','KeepDefaultsExtension customerUpdated', customerUpdated);
			if (customerUpdated) {
				nlapiLogExecution('DEBUG','KeepDefaultsExtension customerUpdate', JSON.stringify(customerUpdate));
				ModelsInit.customer.updateProfile(customerUpdate);
			}
		}
	});

