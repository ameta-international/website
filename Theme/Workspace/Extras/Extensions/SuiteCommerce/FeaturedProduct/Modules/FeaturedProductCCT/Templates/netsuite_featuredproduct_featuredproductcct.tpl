<section class="featuredproductcct-layout">
    <div class="row" style="display: none">
        <div class="image-container col-xs-12 col-sm-6 col-md-6 col-lg-5">
            <img class="center-block product-image" src=""/>
            {{#if hasRibbonText}}
                <div class="ribbon">{{ribbonText}}</div>
            {{/if}}
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-5">

            <div class="product-content product-details-full-main">
                <h1 class="product-name product-details-full-content-header-title" itemprop="name"></h1>
                <p class="product-description"></p>
                {{#if showPrice}}
                    <div class="product-formatted-price product-views-price-lead"></div>
                {{/if}}
                {{#if showItemAvailability}}
                    <div class="product-in-stock product-line-stock" style="display: none;">
                        <span class="stock-availability">
                            <span class="in-stock-icon"><i></i></span> In Stock
                        </span>
                    </div>
                    <div class="product-out-of-stock product-line-stock" style="display: none;">
                        <span class="stock-availability">
                            <span class="out-of-stock-icon"><i></i></span> Out of Stock
                        </span>
                    </div>
                    <div class="product-qty-available" style="display: none;">
                        <p class="product-qty-available-number"></p>
                    </div>
                {{/if}}
                {{#if hasBtnText}}
                    <div class="button-container">
                        <a href="{{btnLink}}" target="{{target}}" class="{{btnStyleClass}}">{{btnText}}</a>
                    </div>
                {{/if}}
            </div>
        </div>

    </div>

</section>