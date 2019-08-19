
function service(request, response)
{
	'use strict';
	try 
	{
		require('ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ACS.AddGoldMemberLogoToHeader.AddGoldMemberLogoToHeader.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}