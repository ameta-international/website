
function service(request, response)
{
	'use strict';
	try 
	{
		require('PS.CustomForms.CCTCustomForms.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PS.CustomForms.CCTCustomForms.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}