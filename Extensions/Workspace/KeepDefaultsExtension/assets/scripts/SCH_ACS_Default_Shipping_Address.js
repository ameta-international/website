/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime'],
    function (search, record, email, runtime) {
        function execute(context) {
            var searchId = "customsearch_acs_get_customer_shipaddr";
            try {
                search.load({
                    id: searchId
                }).run().each(function (result) {
                    try {
                        var customer = record.load({
                                type: record.Type.CUSTOMER,
                                id: result.id
                            }),
                            defaultShippingAddress = customer.getValue('custentity_cs_default_shipaddress') || '',
                            defaultBillingAddress = customer.getValue('custentity_cs_default_billaddress') || '',
                            defaultCreditCard = customer.getValue('custentity_cs_default_creditcard') || '',
                            shippingAddress = result.getValue(result.columns[0]),
                            billingAddress = result.getValue(result.columns[1]),
                            creditCard = result.getValue('ccinternalid');
                            
                            shippingAddress1 = result.getValue('shippingAddress.addressinternalid');
                            billingAddress1 = result.getValue('billingAddress.addressinternalid');

                            log.debug('shippingAddress1', 'default shipping address 1 ' + shippingAddress1);
                            log.debug('billingAddress1', 'default shipping address 1 ' + billingAddress1);
                            


                            log.debug('DEBUG RESULT COLUMNS', JSON.stringify(result.columns));
                            log.debug('DEBUG RESULT', JSON.stringify(result));

                            log.debug('setDefaultAddress', 'customdefault shipping address id ' + defaultShippingAddress);
                            log.debug('shippingAddress', 'default shipping address ' + shippingAddress);
                            log.debug('billingAddress', 'default shipping address ' + billingAddress);
                            log.debug('setDefaultAddress', 'custom default billing address id ' + defaultBillingAddress);

                        if (!!defaultShippingAddress || !!defaultBillingAddress ) {

                            var i, count = customer.getLineCount({
                                    sublistId: 'addressbook'
                                }),
                                currentDefaultShippingAddressId, currentDefaultBillingAddressId, foundDefaultShippingAddressLine, foundDefaultBillingAddressLine, changed = false;

                            for (i = 0; i < count; i++) {
                                var addressId = customer.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'internalid',
                                    line: i
                                });
                                var defaultShipping = customer.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'defaultshipping',
                                    line: i
                                });
                                var defaultBilling = customer.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'defaultbilling',
                                    line: i
                                });
                              
                              log.debug('setDefaultAddress', 'current defaultShipping ' + JSON.stringify(defaultShipping) + ' i: ' +  i);
                              log.debug('setDefaultAddress', 'current addressId ' + addressId + ' i: ' +  i);

                                if (defaultShipping == 'T') {
                                    log.debug('setDefaultAddress', 'current shipping default ' + addressId);
                                    currentDefaultShippingAddressId = addressId;
                                }

                                if (defaultBilling == 'T') {
                                    log.debug('setDefaultAddress', 'current billing default ' + addressId);
                                    currentDefaultBillingAddressId = addressId;
                                }

                                if (addressId == defaultShippingAddress) {
                                    log.debug('setDefaultAddress', 'default shipping address id is valid');
                                    foundDefaultShippingAddressLine = i;
                                }

                                if (addressId == defaultBillingAddress) {
                                    log.debug('setDefaultAddress', 'default billing address id is valid');
                                    foundDefaultBillingAddressLine = i;
                                }
                            
                            }

                            // if already has correct default shipping, do nothing
                            // else if the address is out-dated, set custentity_cs_default_shipaddress to the current one
                            // else loop through addressbook to set the default shipping address
                            if (currentDefaultShippingAddressId == defaultShippingAddress) {
                                log.debug('setDefaultAddress', 'default shipping did not change, do nothing');
                            } else if (typeof foundDefaultShippingAddressLine == 'undefined') {
                                log.debug('setDefaultAddress', 'default shipping address id is invalid, set to the current one ' + currentDefaultShippingAddressId);
                                customer.setValue({
                                    fieldId: 'custentity_cs_default_shipaddress',
                                    value: currentDefaultShippingAddressId
                                });
                                changed = true;
                            } else {
                                log.debug('setDefaultAddress', 'restore default shipping to the default shipping address id');
                                for (i = 0; i < count; i++) {
                                    var isDefault = i == foundDefaultShippingAddressLine ? true : false;
                                    customer.setSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'defaultshipping',
                                        line: i,
                                        value: isDefault
                                    });
                                }
                                changed = true;
                            }

                            // repeat for default billing address
                            if (currentDefaultBillingAddressId == defaultBillingAddress) {
                                log.debug('setDefaultAddress', 'default shipping did not change, do nothing');
                            } else if (typeof foundDefaultBillingAddressLine == 'undefined') {
                                log.debug('setDefaultAddress', 'default billing address id is invalid, set to the current one');
                                customer.setValue({
                                    fieldId: 'custentity_cs_default_billaddress',
                                    value: currentDefaultBillingAddressId
                                });
                                changed = true;
                            } else {
                                log.debug('setDefaultAddress', 'restore default billing to the default billing address id');
                                for (i = 0; i < count; i++) {
                                    var isDefault = i == foundDefaultBillingAddressLine ? true : false;
                                    customer.setSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'defaultbilling',
                                        line: i,
                                        value: isDefault
                                    });
                                }
                                changed = true;
                            }
                        }

                        var i, currentDefaultCreditCardId, foundDefaultCreditCardLine;

                        if (!!defaultCreditCard) {

                            var count = customer.getLineCount({
                                    sublistId: 'creditcards'
                                });
                                
                            for (i = 0; i < count; i++) {
 
                                var isDefaultCC = customer.getSublistValue({
                                    sublistId: 'creditcards',
                                    fieldId: 'ccdefault',
                                    line: i
                                });

                                var creditcardId = customer.getSublistValue({
                                    sublistId: 'creditcards',
                                    fieldId: 'internalid',
                                    line: i
                                });

                                log.debug('CC for isDefaultCC', 'CC for  isDefaultCC ' + isDefaultCC);

                                if (isDefaultCC) {
                                    log.debug('defaultCreditCard', 'current creditcard default ' + creditcardId);
                                    currentDefaultCreditCardId = creditcardId;
                                }

                                if (creditcardId == defaultCreditCard) {
                                    log.debug('setDefaultCreditcard', 'default CreditcardId is valid. creditcardId:  ' +creditcardId );
                                    foundDefaultCreditCardLine = i;
                                }                          
                            }

                            /* log.debug('CC for currentDefaultCreditCardId', 'CC for  currentDefaultCreditCardId' + currentDefaultCreditCardId);
                            log.debug('CC for defaultCreditCard', 'CC for  defaultCreditCard' + defaultCreditCard);
                            log.debug('CC for foundDefaultCreditCardLine ', 'CC for typeof foundDefaultCreditCardLine  ' + typeof(foundDefaultCreditCardLine));
                            log.debug('CC for foundDefaultCreditCardLine ', 'CC for foundDefaultCreditCardLine  ' + foundDefaultCreditCardLine); */
                            
                            // repeat for default credit card
                            if (currentDefaultCreditCardId == defaultCreditCard) {
                                log.debug('setDefaultCreditCard', 'default credit card did not change, do nothing');
                            } else if (typeof foundDefaultCreditCardLine == 'undefined') {
                                log.debug('setDefaultCreditCard 1111', 'default credit card id is invalid, set to the current one');
                                customer.setValue({
                                    fieldId: 'custentity_cs_default_creditcard',
                                    value: currentDefaultCreditCardId
                                });
                                changed = true;
                            } else {
                                log.debug('setDefaultCreditCard', 'restore default creditcard to the default credit card id');
                                for (i = 0; i < count; i++) {
                                    var isDefault = i == foundDefaultCreditCardLine ? true : false;
                                    customer.setSublistValue({
                                        sublistId: 'creditcards',
                                        fieldId: 'ccdefault',
                                        line: i,
                                        value: isDefault
                                    });
                                log.debug('setDefaultCreditCard', 'restore default creditcard to ' + defaultCreditCard);   
                                }
                                changed = true;
                            }


                        }
                        if (!defaultShippingAddress) {
                            log.debug('setDefaultAddress 2222', 'defaultShippingAddress update to ' + shippingAddress);
                            customer.setValue({
                                fieldId: 'custentity_cs_default_shipaddress',
                                value: shippingAddress
                            });
                            changed = true;
                        }
                        if (!defaultBillingAddress) {
                            customer.setValue({
                                fieldId: 'custentity_cs_default_billaddress',
                                value: billingAddress
                            });
                            changed = true;
                        }
                        if (!defaultCreditCard) {
                            customer.setValue({
                                fieldId: 'custentity_cs_default_creditcard',
                                value: creditCard
                            });
                            changed = true;
                        }

                        if (changed) {
                            log.debug('setDefaultAddress', 'customer changed ' + JSON.stringify(customer));
                            customer.save({
                                ignoreMandatoryFields: true
                            });
                        }
                    } catch (e) {
                        log.error('error in customer update', e);
                    }
                    return true;
                });
            } catch (e) {
                log.error('error in search creation', e);
            }
        }
        return {
            execute: execute
        };
    });
