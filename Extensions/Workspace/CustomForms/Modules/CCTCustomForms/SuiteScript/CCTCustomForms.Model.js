// Example of basic CRUD operations of PS.CustomForms.CCTCustomForms

define('PS.CustomForms.CCTCustomForms.Model', [
    'SC.Model',
    'SC.Models.Init',
    'underscore'
], function PSCustomFormsCCTCustomFormsModel(
    SCModel,
    ModelsInit,
    _
) {
    'use strict';

    var FORM_TYPE_CASE = '1';
    // var FORM_TYPE_CUSTOMER = '2';

    var currentDomainMatch = ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints
            .customercenter.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);

    var currentDomain = currentDomainMatch && currentDomainMatch[0];

    return SCModel.extend({
        name: 'PS.CustomForms.CCTCustomForms',

        successMessage: {
            code: 'OK',
            message: 'Your request has been processed!'
        },

        warningMessage: {
            status: 500,
            code: 'ERR_FORM',
            message: 'Something went wrong processing your request, please try again later.'
        },

        generateFormUrl: function generateFormUrl(data) {
            var type = String(data.formType) === FORM_TYPE_CASE ? 'case' : 'lead';
            var url = currentDomain + 'app/site/crm/external' + type + 'page.nl';
            var params = {
                compid: nlapiGetContext().getCompany(),
                formid: data.formId,
                h: data.formHash
            };

            return url + '?' + _(params).map(function eachParam(v, k) { return k + '=' + v; }).join('&');
        },

        create: function create(data) {
            var serviceUrl;
            var serviceData;
            var serviceResponse;
            var responseCode;
            var responseBody;

            try {
                serviceUrl = this.generateFormUrl(data);
                serviceData = _(data).omit(['formId', 'formHash', 'formType']);

                serviceData = _(serviceData).extend({
                    compid: nlapiGetContext().getCompany(),
                    formid: data.formId,
                    h: data.formHash
                });

                nlapiLogExecution('debug', 'serviceUrl', serviceUrl);
                nlapiLogExecution('debug', 'serviceData', JSON.stringify(serviceData));

                serviceResponse = nlapiRequestURL(serviceUrl, serviceData);

                nlapiLogExecution('debug', 'serviceResponse', '');
                responseBody = serviceResponse.getBody();
                nlapiLogExecution('debug', 'responseBody', responseBody);
                responseCode = parseInt(serviceResponse.getCode(), 10);
                nlapiLogExecution('debug', 'responseCode', responseCode);

                // Just in case someday it accepts the redirect. 206 is netsuite error ('partial content')
                if (responseCode === 200 || responseCode === 201 || responseCode === 302) {
                    return this.successMessage;
                }
            } catch (e) {
                nlapiLogExecution('debug', 'serviceException', e);
                // If the form submit SUCCEEDS!!! it will throw an exception
                // Because of the url redirect
                if (e instanceof nlobjError && e.getCode().toString() === 'ILLEGAL_URL_REDIRECT') {
                    return this.successMessage;
                }
                this.warningMessage = e.message || this.warningMessage;
            }

            if (responseBody) {
                responseBody = responseBody.substr(responseBody.lastIndexOf('class=text') + 'class=text'.length + 1);
                responseBody = responseBody.substr(0, responseBody.indexOf('</'));
                responseBody = responseBody.replace(/<\/?[^>]+(>|$)/g, '').trim();
            }
            throw responseBody || this.warningMessage;
        }
    });
});
