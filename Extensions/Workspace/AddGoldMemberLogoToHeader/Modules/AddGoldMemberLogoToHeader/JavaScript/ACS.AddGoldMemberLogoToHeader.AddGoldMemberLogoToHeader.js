
define(
	'ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader'
,   [
		'ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader.View'
	]
,   function (
		AddGoldMemberLogoToHeaderView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container) {
			var layout = container.getComponent('Layout');
			if(layout) {
				layout.addChildViews(layout.ALL_VIEWS, {
					  'Header.Profile': {
						'Header.Profile.GoldMemberLogo': {
						  childViewIndex: -10,
						  childViewConstructor: function () {
							return new AddGoldMemberLogoToHeaderView({ container: container });
						  }
						}
					  }
					}
				  );
			}
		}
	};
});
