/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/log'],
    function(record, runtime, log) {
        /**
         * @param {nlobjContext} context
         */
        function beforeSubmit(context) {
            if ((context.type !== context.UserEventType.CREATE &&
                context.type !== context.UserEventType.EDIT) ||
                runtime.executionContext !== runtime.ContextType.USER_INTERFACE) {
                return;
            }
            var currentRecord = context.newRecord;
            try {
                var billing = null;
                var shipping = null;
                var card = null;
                var custBilling = currentRecord.getValue('custentity_cs_default_billaddress');
                var custShipping = currentRecord.getValue('custentity_cs_default_shipaddress');
                var custCard = currentRecord.getValue('custentity_cs_default_creditcard');

                var billingLine = currentRecord.findSublistLineWithValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultbilling',
                    value: 'T'
                });
                var shippingLine = currentRecord.findSublistLineWithValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultshipping',
                    value: 'T'
                });

                var creditCardLine = currentRecord.findSublistLineWithValue({
                    sublistId: 'creditcards',
                    fieldId: 'ccdefault',
                    value: 'T'
                });

                if (billingLine >= 0) {
                    billing = currentRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'internalid',
                        line: billingLine
                    });
                }
                if (shippingLine >= 0) {
                    shipping = currentRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'internalid',
                        line: shippingLine
                    });
                }

                if (creditCardLine >= 0) {
                    card = currentRecord.getSublistValue({
                        sublistId: 'creditcards',
                        fieldId: 'internalid',
                        line: creditCardLine
                    });
                }

                if (billing && billing !== custBilling) {
                    currentRecord.setValue('custentity_cs_default_billaddress', billing);
                }
                if (shipping && shipping !== custShipping) {
                    currentRecord.setValue('custentity_cs_default_shipaddress', shipping);
                }
                if (card && card !== custCard) {
                    currentRecord.setValue('custentity_cs_default_creditcard', card);
                }
            } catch (e) {
                log.error({
                    title: e.name,
                    details: e.message
                });
            }
        }
        return {
            beforeSubmit: beforeSubmit
        };
    }
);