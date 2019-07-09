define('ACS.AddRegisterLinkToHeader.AddRegisterLinkToHeader.View'
,	[
		'acs_addregisterlinktoheader_addregisterlinktoheader.tpl'
	,	'Profile.Model'
	,	'Backbone'
	,	'underscore'
	]
,	function (
		acs_addregisterlinktoheader_addregisterlinktoheader_tpl
	,	ProfileModel
	,	Backbone
	,	_
	)
{
	'use strict';
	
	return Backbone.View.extend({

		template: acs_addregisterlinktoheader_addregisterlinktoheader_tpl

	,	initialize: function (options) {
			this.showRegisterLink = true;
			try {
				var profileInstance = ProfileModel.getInstance();
				var userIsLoggedInValue = (profileInstance.get('isLoggedIn'));
				this.showRegisterLink = !userIsLoggedInValue || userIsLoggedInValue === "F";
			} catch (exc) {
				console.log('There was an error while processing the register link.');
			}
		}

	,	getContext: function getContext() {
			return {
				showRegisterLink: this.showRegisterLink
			};
		}
	});
});