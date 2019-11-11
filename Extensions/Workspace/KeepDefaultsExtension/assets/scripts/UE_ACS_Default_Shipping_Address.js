/**
 * @NAPIVersion 2.0
 * @NScriptType UserEventScript
 */

define(['N/record', 'N/runtime', 'N/log'],
    /**
     * @param {record} record
     * @param {runtime} runtime
     */
    function (
        record, runtime, log
    ) {

        function setDefaultShippingAddress(context) {           
            if (context.type == context.UserEventType.CREATE) {
                log.debug('setDefaultShippingAddress', 'START');
                var newRecord = context.newRecord;

                var customer = record.load({
                        type: record.Type.CUSTOMER,
                        id: newRecord.getValue('entity')
                    }),
                    customerChanged = false,
                    defaultShippingAddress = customer.getValue('custentity_cs_default_shipaddress') || '',
                    defaultBillingAddress = customer.getValue('custentity_cs_default_billaddress') || '',
                    defaultCreditCard = customer.getValue('custentity_cs_default_creditcard') || '';

                var i;
                var count = customer.getLineCount({
                    sublistId: 'addressbook'
                });
                var currentDefaultShippingAddressId;
                var currentDefaultBillingAddressId;
                var foundDefaultShippingAddressLine;
                var foundDefaultBillingAddressLine;
            
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

                    if (defaultShipping) {
                        currentDefaultShippingAddressId = addressId;
                    }

                    if (addressId == defaultShippingAddress) {
                        foundDefaultShippingAddressLine = i;
                    }
                    if (defaultBilling) {
                        currentDefaultBillingAddressId = addressId;
                    }

                    if (addressId == defaultBillingAddress) {
                        foundDefaultBillingAddressLine = i;
                    }
                }

                // if already has correct default shipping, do nothing
                // else if the address is out-dated, set custentity_cs_default_shipaddress to the current one
                // else loop through addressbook to set the default shipping address
                if (typeof foundDefaultShippingAddressLine == 'undefined') {
                    customer.setValue({
                        fieldId: 'custentity_cs_default_shipaddress',
                        value: currentDefaultShippingAddressId
                    });
                    customerChanged = true;
                } else if (currentDefaultShippingAddressId != defaultShippingAddress) {
                    // 'restore default shipping to the default shipping address id
                    for (i = 0; i < count; i++) {
                        var isDefault = i == foundDefaultShippingAddressLine ? true : false;
                        customer.setSublistValue({
                            sublistId: 'addressbook',
                            fieldId: 'defaultshipping',
                            line: i,
                            value: isDefault
                        });
                    }
                    customerChanged = true;
                }

                if (typeof foundDefaultBillingAddressLine == 'undefined') {
                    customer.setValue({
                        fieldId: 'custentity_cs_default_billaddress',
                        value: currentDefaultBillingAddressId
                    });
                    customerChanged = true;
                } else if (currentDefaultBillingAddressId != defaultBillingAddress) {
                    // 'restore default billing to the default shipping address id
                    for (i = 0; i < count; i++) {
                        var isDefault = i === foundDefaultBillingAddressLine ? true : false;
                        customer.setSublistValue({
                            sublistId: 'addressbook',
                            fieldId: 'defaultbilling',
                            line: i,
                            value: isDefault
                        });
                    }
                    customerChanged = true;
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
                    
                    // repeat for default credit card
                    if (currentDefaultCreditCardId == defaultCreditCard) {
                        log.debug('setDefaultCreditCard', 'default credit card did not change, do nothing');
                    } else if (typeof foundDefaultCreditCardLine == 'undefined') {
                        log.debug('setDefaultCreditCard', 'default credit card id is invalid, set to the current one');
                        customer.setValue({
                            fieldId: 'custentity_cs_default_creditcard',
                            value: currentDefaultCreditCardId
                        });
                        customerChanged = true;
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
                        }
                        log.debug('setDefaultCreditCard', 'restore default creditcard to ' + defaultCreditCard);
                        customerChanged = true;
                    }
                }

                if (customerChanged) {
                    customer.save({
                        ignoreMandatoryFields: true
                    });
                }
            }

            return true;
        }

        return {
            afterSubmit: setDefaultShippingAddress
        };

    });
