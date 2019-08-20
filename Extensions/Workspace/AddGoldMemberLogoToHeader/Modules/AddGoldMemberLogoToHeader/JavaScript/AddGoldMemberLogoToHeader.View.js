// @module ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader
define('ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader.View'
,	[
		'acs_addgoldmemberlogotoheader_addgoldmemberlogotoheader.tpl'
	,	'Profile.Model'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		acs_addgoldmemberlogotoheader_addgoldmemberlogotoheader_tpl
	,	ProfileModel
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader.View @extends Backbone.View
	return Backbone.View.extend({

		template: acs_addgoldmemberlogotoheader_addgoldmemberlogotoheader_tpl

	,	initialize: function (options) {
			this.showGoldMemberLogo = false;
			try {
				var profileInstance = ProfileModel.getInstance();
				var userIsLoggedInValue = (profileInstance.get('isLoggedIn'));
				var userIsGoldValue = (profileInstance.get('priceLevel'));
				this.showGoldMemberLogo = userIsLoggedInValue === "T" && userIsGoldValue === "10";
				
			} catch (exc) {
				console.log('There was an error while processing the users membership.');
			}
		}

	,	getContext: function getContext() {
			return {
				showGoldMemberLogo: this.showGoldMemberLogo
			};
		}
	});
});