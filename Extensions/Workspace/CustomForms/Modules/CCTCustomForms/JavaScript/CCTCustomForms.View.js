define('CCTCustomForms.View', [
    'CustomContentType.Base.View',
    'CCTCustomForms.Model',

    'customforms.tpl',

    'Backbone',
    'Backbone.FormView',
    'SC.Configuration',
    'underscore',
    'jQuery'
], function CCTCustomFormsView(
    CustomContentTypeBaseView,
    CCTCustomFormsModel,

    customFormsTpl,

    Backbone,
    BackboneFormView,
    Configuration,
    _,
    jQuery
) {
    'use strict';

    /**
     * data-validate-required-message="message"
     * data-validate-required
     * data-validate-state
     * data-validate-zip
     * data-validate-phone
     * data-validate-email
     */

    return CustomContentTypeBaseView.extend({
        template: customFormsTpl,

        events: {
            'blur [type="date"]': 'normalizeDate',
            'blur [type="time"]': 'normalizeTime',
            'blur [type="number"]': 'normalizeNumber',
            'blur [type="datetime"]': 'normalizeDateTime',
            'blur [data-validate-datetime]': 'normalizeDateTime',
            'blur [data-validate-integer]': 'normalizeInteger',
            'blur [data-validate-link]': 'normalizeLink',
            'blur [data-validate-percent]': 'normalizePercent',
            'submit form': 'submitForm'
        },

        validators: {
            validateEmail: function validateEmail(value) {
                if (value && !Backbone.Validation.patterns.email.test(value)) {
                    return 'A valid email address is required';
                }
                return '';
            },

            validatePhone: function validatePhone(value) {
                return value ? _.validatePhone.apply(_, arguments) : '';
            },

            validateState: function validateState(value) {
                return value ? _.validateState.apply(_, arguments) : '';
            },

            validateZipCode: function validateZipCode(value) {
                return value ? _.validateZipCode.apply(_, arguments) : '';
            }
        },

        normalizeNumber: function normalizeNumber(e) {
            var self = this;
            var $input = this.$(e.target);
            var value = Number($input.val().replace(/[^0-9.]/g, '')) || '';

            $input.prop('type', value ? 'text' : 'number').val(value);
            $input.off('blur').on('blur', function onBlur(ev) { self.normalizeNumber(ev); });
        },

        normalizeDate: function normalizeDate(e) {
            var $input = this.$(e.target);
            var date = new Date($input.val());
            var value;

            if (date.getDate()) {
                value = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            } else {
                value = '';
            }
            $input.val(value);
        },

        normalizeTime: function normalizeTime(e) {
            var self = this;
            var $input = this.$(e.target);
            var date = new Date('1/1/2000 ' + $input.val().replace(/(am|pm)/, ''));
            var value;
            var hours;
            var pad = function pad(num) {
                return ('0' + num).substr(-2);
            };

            if (date.getDate()) {
                hours = date.getHours();
                hours += /pm/.test($input.val()) && hours < 12 ? 12 : 0;
                value = (hours > 12 ? hours - 12 : hours || 12) + ':' + pad(date.getMinutes());
                value += ' ' + (hours > 11 ? 'pm' : 'am');
            } else {
                value = '';
            }
            $input.prop('type', value ? 'text' : 'time').val(value);
            $input.off('blur').on('blur', function onBlur(ev) { self.normalizeTime(ev); });
        },

        normalizeDateTime: function normalizeDateTime(e) {
            var $input = this.$(e.target);
            var date = new Date($input.val().replace(/(am|pm)/, ''));
            var value;
            var hours;
            var pad = function pad(num) {
                return ('0' + num).substr(-2);
            };

            if (date.getDate()) {
                hours = date.getHours();
                hours += /pm/.test($input.val()) && hours < 12 ? 12 : 0;
                value = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                value += ' ' + (hours > 12 ? hours - 12 : hours || 12) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
                value += ' ' + (hours > 11 ? 'pm' : 'am');
            } else {
                value = '';
            }
            $input.val(value);
        },

        normalizeInteger: function normalizeInteger(e) {
            var $input = this.$(e.target);
            var value = parseInt($input.val(), 10) || '';

            $input.val(value);
        },

        normalizeLink: function normalizeLink(e) {
            var $input = this.$(e.target);
            var value = $input.val();

            if (!/^http(|s):\/\//.test(value)) {
                value = 'http://' + value;
            }
            $input.val(value);
        },

        normalizePercent: function normalizePercent(e) {
            var $input = this.$(e.target);
            var value = Number($input.val().replace(/%$/, '')) || '';

            if (value) {
                value += '%';
            }
            $input.val(value);
        },

        initialize: function initialize() {
            var self = this;

            this.model = new CCTCustomFormsModel();

            CustomContentTypeBaseView.prototype.initialize.apply(this, arguments);
            BackboneFormView.add(this);

            this.on('afterViewRender', self.afterRender);
        },

        submitForm: function submitForm(e) {
            var self = this;
            var promise;

            this.model.validation = this.validation || {};
            promise = this.saveForm(e);

            if (promise) {
                promise.fail(function fail(jqXhr) {
                    self.statusMessage = {
                        code: 'error',
                        message: jqXhr.responseJSON ? jqXhr.responseJSON.errorMessage : 'Something went wrong processing your request, please try again later.'
                    };
                    jqXhr.preventDefault = true;
                }).done(function done(result) {
                    self.statusMessage = {
                        code: 'success',
                        message: result.message || 'Your request has been processed!'
                    };
                    self.$('input:visible, select:visible, textarea:visible').val('');
                }).always(function always() {
                    self.showStatusMessage();
                });
            }
            return e.stopPropagation() || e.preventDefault();
        },

        showStatusMessage: function showStatusMessage() {
            var $alert = this.$('[data-type="alert-placeholder"]').removeClass('hide message-success message-error');

            $alert.addClass(this.statusMessage.code === 'success' ? 'message-success' : 'message-error');
            $alert.html(_(this.statusMessage.message).translate()).fadeIn(400).delay(10000).fadeOut();
        },

        afterRender: function afterRender() {
            var settings = this.settings;

            this.applyTranslations();

            // Form configuration
            this.model.set('formId', settings.custrecord_custom_form_id);
            this.model.set('formHash', settings.custrecord_custom_form_hash);
            this.model.set('formType', settings.custrecord_custom_form_type);

            // Auto-populated fields
            this.setCurrency();
            this.setSubsidiary();

            // Field validations
            this.applyValidations();
        },

        setSubsidiary: function setSubsidiary() {
            var $subsidiary = this.$('[name="subsidiary"]');
            var subsidiaries = Configuration.siteSettings.subsidiaries || [];
            var subsidiary;

            if (!_.isEmpty($subsidiary) && subsidiaries.length) {
                subsidiary = _(subsidiaries).findWhere({ isdefault: 'T' });
                if (!_.isEmpty(subsidiary)) {
                    $subsidiary.val(subsidiary.internalid);
                }
            }
        },

        setCurrency: function setCurrency() {
            var $currency = this.$('[name="currency"]');
            var currencies = Configuration.siteSettings.currencies || [];
            var currency;

            if (!_.isEmpty($currency) && currencies.length) {
                currency = _(currencies).findWhere({ isdefault: 'T' });
                if (!_.isEmpty(currency)) {
                    $currency.val(currency.internalid);
                }
            }
        },

        applyTranslations: function applyTranslations() {
            this.$('[data-translate]').each(function eachValidateRequired() {
                var $this = jQuery(this);
                var text = _($this.text().trim()).translate();

                $this.text(text);
            });
        },

        applyValidations: function applyValidations() {
            var self = this;
            var validationObject = {};

            this.$('[data-validate-required]').each(function eachValidateRequired() {
                var $this = jQuery(this);
                var name = $this.attr('name');
                var defaultValue = (name + ' is required');

                validationObject[name] = {
                    required: true,
                    msg: _($this.data('validateRequiredMessage') || defaultValue).translate()
                };
            });

            this.$('[data-validate-state]').each(function eachValidateState() {
                var $this = jQuery(this);
                var name = $this.attr('name');
                var defaultValue = ('A valid state is required');

                validationObject[name] = (validationObject[name] || {});
                _(validationObject[name]).extend({
                    fn: self.validators.validateState,
                    msg: _($this.data('validateRequiredMessage') || defaultValue).translate()
                });
            });

            this.$('[data-validate-zip]').each(function eachValidateZip() {
                var $this = jQuery(this);
                var name = $this.attr('name');
                var defaultValue = ('A valid zip code is required');

                validationObject[name] = (validationObject[name] || {});
                _(validationObject[name]).extend({
                    fn: self.validators.validateZipCode,
                    msg: _($this.data('validateRequiredMessage') || defaultValue).translate()
                });
            });

            this.$('[data-validate-phone]').each(function eachValidatePhone() {
                var $this = jQuery(this);
                var name = $this.attr('name');
                var defaultValue = ('A valid phone number is required');

                validationObject[name] = (validationObject[name] || {});
                _(validationObject[name]).extend({
                    fn: self.validators.validatePhone,
                    msg: _($this.data('validateRequiredMessage') || defaultValue).translate()
                });
            });

            this.$('[data-validate-email]').each(function eachValidateEmail() {
                var $this = jQuery(this);
                var name = $this.attr('name');
                var defaultValue = ('A valid email address is required');

                validationObject[name] = (validationObject[name] || {});
                _(validationObject[name]).extend({
                    fn: self.validators.validateEmail,
                    msg: _($this.data('validateRequiredMessage') || defaultValue).translate()
                });
            });

            this.validation = validationObject;
        },

        getContext: function getContext() {
            return {
                formId: this.settings.custrecord_custom_form_id,
                formContent: this.settings.custrecord_custom_form_html
            };
        }
    });
});
