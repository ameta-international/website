
define(
	'ACS.ACSFixFacetDropdown.ACSFixFacetDropdown'
,   ['Facets.Browse.View'
	]
,   function (FacetsBrowseView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// using the 'Layout' component we add a new child view inside the 'Header' existing view 
			// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
			// more documentation of the Extensibility API in
			// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html
			
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');
			
			if(layout && !SC.isPageGenerator())
			{
				var self = this;
				layout.on('afterShowContent', function(view) 
				{ 
					if(view === FacetsBrowseView.prototype.attributes.id)
					{
						var $myGroup = $('.facets-facet-browse-facets .facets-faceted-navigation>div');
						$myGroup.on('show.bs.collapse','.collapse', function() {
								$myGroup.find('.collapse.in').collapse('hide');
						});
					}
				});
			}
		}
	};
});
