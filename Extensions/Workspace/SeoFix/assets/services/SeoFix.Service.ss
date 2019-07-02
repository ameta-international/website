
function service(request, response)
{
	'use strict';
	try 
	{
		require('PS.SeoFix.SeoFix.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PS.SeoFix.SeoFix.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}