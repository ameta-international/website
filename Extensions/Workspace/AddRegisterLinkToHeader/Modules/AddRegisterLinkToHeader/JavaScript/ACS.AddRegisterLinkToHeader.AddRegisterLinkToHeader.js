
define(
	'ACS.AddRegisterLinkToHeader.AddRegisterLinkToHeader'
,   [
		'ACS.AddRegisterLinkToHeader.AddRegisterLinkToHeader.View'
	// ,	'Profile'
	]
,   function (
		AddRegisterLinkToHeaderView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container) {
			var layout = container.getComponent('Layout');
			if(layout) {
				layout.addChildViews(layout.ALL_VIEWS, {
					  'Header.Profile': {
						'Header.Profile.RegisterLink': {
						  childViewIndex: 1,
						  childViewConstructor: function () {
							return new AddRegisterLinkToHeaderView({ container: container });
						  }
						}
					  }
					}
				  );
			}
		}
	};
});
