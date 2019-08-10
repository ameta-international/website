{{#if isNotCompany}}
<div class="profile-information-row" data-input="firstname" data-validation="control-group">
    <label class="profile-information-label">{{translate 'First Name'}}</label>
    <div class="profile-information-group-form-controls" data-validation="control">
        {{firstName}}
    </div>
</div>

<div class="profile-information-row" data-input="lastname" data-validation="control-group">
    <label class="profile-information-label">{{translate 'Last Name'}}</label>
    <div class="profile-information-group-form-controls" data-validation="control">
        {{lastName}}
    </div>
</div>
{{/if}}

{{#if isCompanyAndShowCompanyField}}
<div class="profile-information-row" data-input="companyname" data-validation="control-group">
    <label class="profile-information-label">{{translate 'Company Name'}}</label>
    <div class="profile-information-group-form-controls" data-validation="control">
        {{companyName}}
    </div>
</div>
{{/if}}

<div class="profile-information-row" data-input="phone" data-validation="control-group">
    <label class="profile-information-label">{{translate 'Phone Number'}}</label>
    <div class="profile-information-group-form-controls" data-validation="control">
        {{phone}}
    </div>
</div>
