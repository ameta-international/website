
define('CSeComm.ExternalCSS.Checkout',
[
	'jQuery'
] , function (
	jQuery
) {
	'use strict';

	return  {
		mountToApp: function mountToApp (container) {
			var cssfile = container.getConfig('externalcss.checkoutCss');
			if (!cssfile) return;
			var element = jQuery('link[id=externalcss]');
			if (!element.size()) {
				element = jQuery('<link id="externalcss" rel="stylesheet">').attr('href', cssfile).appendTo(jQuery('head'));
			}
			else {
				element.attr('href', cssfile);
			}
		}
	};
});
