<a class="header-mini-cart-menu-cart-link {{#if showLines}}header-mini-cart-menu-cart-link-enabled{{/if}}" data-type="mini-cart" title="{{translate 'Cart'}}" data-touchpoint="{{cartTouchPoint}}" data-hashtag="#cart" href="#">
	<i class="header-mini-cart-menu-cart-icon">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="svg-shopping-trolley">
			<path class="svg-path-shopping-trolley"
				d="M312 355.5c-10.6 0-19.8-3.9-27.4-11.4 -7.6-7.6-11.4-16.9-11.4-27.7 0-6.1 1.3-11.7 3.8-16.8h-97.7c2.5 5.1 3.8 10.7 3.8 16.8 0 10.8-3.8 20.1-11.4 27.7 -15.2 15.2-39.7 15.2-54.8 0 -7.6-7.6-11.4-16.8-11.4-27.4 0-6.9 1.7-13.4 5.2-19.4 2.7-4.6 6.2-8.6 10.4-11.9l-39-190.9H46.1c-5.5 0-10.4-2-14.3-5.9s-5.9-8.8-5.9-14.3v-9.3c0-5.5 2-10.4 5.9-14.3s8.8-5.9 14.3-5.9h60c4.6 0 8.8 1.6 12.5 4.7 3.5 3 5.9 6.7 7 11.1l4.3 21.5h224c6.6 0 12.1 2.6 16 7.6 3.9 5 5.1 11 3.4 17.1l-27.3 121c-1.1 4.9-3.5 8.9-7.2 11.7 -3.6 2.8-7.7 4.2-12.2 4.2H163.2l1.2 6.2H316c6.2 0 11.5 2.6 15.4 7.6 3.8 4.9 5.2 10.6 4.1 16.6l-2.5 10.3c4.8 3 8.8 7 11.8 11.8 3.9 6.2 5.9 13.1 5.9 20.5 0 10.6-3.9 19.8-11.4 27.4C331.8 351.6 322.6 355.5 312 355.5zM151.1 287.1h153.8l-11.4 10.8c-5.3 5-8 11.1-8 18.5 0 7.5 2.6 13.7 7.8 18.9 10.5 10.5 26.8 10.5 37.2 0 5.2-5.2 7.8-11.3 7.8-18.6 0-5.1-1.3-9.6-4-13.9 -2.7-4.3-6.3-7.4-11.1-9.6l-4.6-2.2 4.7-19.5c0.4-2.2-0.1-4.3-1.8-6.4 -1.6-2-3.2-2.8-5.6-2.8h-162l-5.8-31.1h178.3c1.7 0 3.2-0.5 4.7-1.6 1.4-1.1 2.2-2.5 2.7-4.6v0l27.4-121.2c0.7-2.7 0.4-4.5-1.2-6.5 -1.5-2-3.4-2.8-6.2-2.8H119.7l-6.2-31.2c-0.4-1.6-1.3-3-2.9-4.3 -1.4-1.2-2.8-1.7-4.4-1.7h-60c-2.3 0-4 0.7-5.5 2.3 -1.6 1.6-2.3 3.3-2.3 5.5v9.3c0 2.3 0.7 4 2.3 5.5 1.6 1.6 3.3 2.3 5.5 2.3H92L134.7 291l-3.7 2.3c-4.2 2.6-7.4 5.9-9.8 10.1 -2.4 4.1-3.5 8.5-3.5 13.2 0 7.3 2.6 13.4 7.8 18.6 10.5 10.5 26.8 10.5 37.3 0 5.2-5.2 7.8-11.4 7.8-18.9 0-7.4-2.6-13.5-8-18.5L151.1 287.1z">
			</path>
		</svg>
	</i>
	<span class="header-mini-cart-menu-cart-legend">
		{{#if isLoading}}
		<span class="header-mini-cart-summary-cart-ellipsis"></span>
		{{else}}
				{{translate '$(0)' itemsInCart}}
		{{/if}}
	</span>
</a>
<div class="header-mini-cart">
	 {{#if showLines}} 
	 	<div data-view="Header.MiniCartItemCell" class="header-mini-cart-container"></div>
		<div class="header-mini-cart-subtotal">
			<div class="header-mini-cart-subtotal-items">
				{{#if showPluraLabel}}
					{{translate '$(0) items' itemsInCart}}
				{{else}}
					{{translate '1 item'}}
				{{/if}}
			</div>

			{{#if isPriceEnabled}}
			<div class="header-mini-cart-subtotal-amount">
				{{translate 'SUBTOTAL: $(0)' subtotalFormatted}}
			</div>
			{{/if}}
		</div>

		<div class="header-mini-cart-buttons">
			<div class="header-mini-cart-buttons-left">
				<a href="#" class="header-mini-cart-button-view-cart" data-touchpoint="{{cartTouchPoint}}" data-hashtag="#cart" >
					{{translate 'View Cart'}}
				</a>
			</div>
			<div class="header-mini-cart-buttons-right">
				<a href="#" class="header-mini-cart-button-checkout" data-touchpoint="checkout" data-hashtag="#" >
					{{translate 'Checkout'}}
				</a>
			</div>
		</div>

		{{else}} 
		<div class="header-mini-cart-empty">
			<a href="#" data-touchpoint="{{cartTouchPoint}}" data-hashtag="#cart">
				{{#if isLoading}}
					{{translate 'Your cart is loading'}}
				{{else}}
					{{translate 'Your cart is empty'}}
				{{/if}}
			</a>
		</div>
	{{/if}} 
</div>





{{!----
Use the following context variables when customizing this template: 
	
	model (Object)
	model.addresses (Array)
	model.addresses.0 (Object)
	model.addresses.0.zip (String)
	model.addresses.0.country (String)
	model.addresses.0.company (undefined)
	model.addresses.0.internalid (String)
	model.shipmethods (Array)
	model.lines (Array)
	model.paymentmethods (Array)
	model.internalid (String)
	model.confirmation (Object)
	model.confirmation.addresses (Array)
	model.confirmation.shipmethods (Array)
	model.confirmation.lines (Array)
	model.confirmation.paymentmethods (Array)
	model.multishipmethods (Array)
	model.lines_sort (Array)
	model.latest_addition (undefined)
	model.promocodes (Array)
	model.ismultishipto (Boolean)
	model.shipmethod (undefined)
	model.billaddress (undefined)
	model.shipaddress (String)
	model.isPaypalComplete (Boolean)
	model.touchpoints (Object)
	model.touchpoints.logout (String)
	model.touchpoints.customercenter (String)
	model.touchpoints.serversync (String)
	model.touchpoints.viewcart (String)
	model.touchpoints.login (String)
	model.touchpoints.welcome (String)
	model.touchpoints.checkout (String)
	model.touchpoints.continueshopping (String)
	model.touchpoints.home (String)
	model.touchpoints.register (String)
	model.touchpoints.storelocator (String)
	model.agreetermcondition (Boolean)
	model.summary (Object)
	model.summary.discounttotal_formatted (String)
	model.summary.taxonshipping_formatted (String)
	model.summary.taxondiscount_formatted (String)
	model.summary.itemcount (Number)
	model.summary.taxonhandling_formatted (String)
	model.summary.total (Number)
	model.summary.tax2total (Number)
	model.summary.discountedsubtotal (Number)
	model.summary.taxtotal (Number)
	model.summary.discounttotal (Number)
	model.summary.discountedsubtotal_formatted (String)
	model.summary.taxondiscount (Number)
	model.summary.handlingcost_formatted (String)
	model.summary.taxonshipping (Number)
	model.summary.taxtotal_formatted (String)
	model.summary.totalcombinedtaxes_formatted (String)
	model.summary.handlingcost (Number)
	model.summary.totalcombinedtaxes (Number)
	model.summary.giftcertapplied_formatted (String)
	model.summary.shippingcost_formatted (String)
	model.summary.discountrate (Number)
	model.summary.taxonhandling (Number)
	model.summary.tax2total_formatted (String)
	model.summary.discountrate_formatted (String)
	model.summary.estimatedshipping (Number)
	model.summary.subtotal (Number)
	model.summary.shippingcost (Number)
	model.summary.estimatedshipping_formatted (String)
	model.summary.total_formatted (String)
	model.summary.giftcertapplied (Number)
	model.summary.subtotal_formatted (String)
	model.options (Object)
	itemsInCart (Number)
	showPluraLabel (Boolean)
	showLines (Boolean)
	isLoading (Boolean)
	subtotalFormatted (String)
	cartTouchPoint (String)
	isPriceEnabled (Boolean)

----}}
