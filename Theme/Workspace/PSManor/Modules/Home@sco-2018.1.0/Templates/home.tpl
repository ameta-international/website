<div class="home">
	<div data-cms-area="home_cms_area_manor_1" data-cms-area-filters="path"></div>

	{{#if extraHomeView.isReady}}
	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider id="home-image-slider-list">
				{{#if extraHomeView.showCarousel}}
				{{#each extraHomeView.carousel}}
                <li>
					<a href="{{href}}">
						<div class="home-slide-main-container">
							{{#if isAbsoluteUrl}}
							<div class="home-slide-image-container" style="background-image:url('{{image}}');">
								<img src="{{image}}">
							</div>
							{{else}}
							<div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPathWithDefault image 'img/carousel-home-1.jpg'}}');">
								<img src="{{getThemeAssetsPathWithDefault image 'img/carousel-home-1.jpg'}}">
							</div>
							{{/if}}

							<div class="home-slide-caption-container {{#if class}}{{class}}{{else}}carousel-center{{/if}}">
								<div class="home-slide-caption">
									{{#if title}}<h1 class="home-slide-caption-title">{{{title}}}</h1>{{/if}}
									{{#if text}}<h2 class="home-slide-caption-text">{{{text}}}</h2>{{/if}}
									<div class="home-slide-caption-button-container">
										<div class="home-slide-caption-button">{{#if text}}{{{linktext}}}{{else}}{{translate 'Shop now'}}{{/if}}</div>
									</div>
								</div>
							</div>
						</div>
					</a>
                </li>
                {{/each}}
				{{else}}
				{{#each carouselImages}}
					<li>
						<a href="/search">
							<div class="home-slide-main-container">
								<div class="home-slide-image-container" style="background-image:url('{{this}}');">
									<img src="{{this}}">
								</div>

								<div class="home-slide-caption-container">
									<div class="home-slide-caption">
										<h1 class="home-slide-caption-title">SAMPLE HEADLINE</h1>
										<h2 class="home-slide-caption-text">Sample Text</h2>
										<div class="home-slide-caption-button-container">
											<div class="home-slide-caption-button">{{translate 'Shop now'}}</div>
										</div>
									</div>
								</div>
							</div>
						</a>
					</li>
				{{else}}
				<li>
					<a href="/search">
						<div class="home-slide-main-container">
							<div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/carousel-home-1.jpg'}}');">
								<img src="{{getThemeAssetsPath 'img/carousel-home-1.jpg'}}">
							</div>

							<div class="home-slide-caption-container">
								<div class="home-slide-caption">
									<h1 class="home-slide-caption-title">SAMPLE HEADLINE</h1>
									<h2 class="home-slide-caption-text">Sample Text</h2>
									<div class="home-slide-caption-button-container">
										<div class="home-slide-caption-button">{{translate 'Shop now'}}</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				</li>
				<li>
					<a href="/search">
						<div class="home-slide-main-container">
							<div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/carousel-home-2.jpg'}}');">
								<img src="{{getThemeAssetsPath 'img/carousel-home-2.jpg'}}">
							</div>

							<div class="home-slide-caption-container">
								<div class="home-slide-caption">
									<h1 class="home-slide-caption-title">SAMPLE HEADLINE</h1>
									<h2 class="home-slide-caption-text">Sample Text</h2>
									<div class="home-slide-caption-button-container">
										<div class="home-slide-caption-button">{{translate 'Shop now'}}</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				</li>
				<li>
					<a href="/search">
						<div class="home-slide-main-container">
							<div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/carousel-home-3.jpg'}}');">
								<img src="{{getThemeAssetsPath 'img/carousel-home-3.jpg'}}">
							</div>

							<div class="home-slide-caption-container">
								<div class="home-slide-caption">
									<h1 class="home-slide-caption-title">SAMPLE HEADLINE</h1>
									<h2 class="home-slide-caption-text">Sample Text</h2>
									<div class="home-slide-caption-button-container">
										<div class="home-slide-caption-button">{{translate 'Shop now'}}</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				</li>
				{{/each}}
				{{/if}}
			</ul>
		</div>
	</div>
	{{/if}}

	<!-- CMS ZONE -->
	<div data-cms-area="home_cms_area_manor_2" data-cms-area-filters="path"></div>

	<!-- FIRST INFOBLOCKS -->
	{{#if extraHomeView.showInfoblocks}}
	<div class="home-infoblock-layout">
		{{#each extraHomeView.infoBlocks}}
		<div class="home-infoblock">
			<a{{objectToAtrributes item}} class="home-infoblock-link">
				<img class="home-infoblock-image" src="{{#if image}}{{image}}{{else}}{{getThemeAssetsPath 'img/banner-bottom-home-1.jpg'}}{{/if}}" alt="{{title}}" />
				{{#if title}}<div class="home-infoblock-text">{{title}}</div>{{/if}}
			</a>
		</div>
		{{/each}}
	</div>
	{{else}}
	<!-- If the Infoblocks section is not used, can use Bottom Banners instead -->
	<div class="home-infoblock-layout">
		{{#each bottomBannerImages}}
		<div class="home-infoblock">
			<a href="/search" class="home-infoblock-link">
				<img class="home-infoblock-image" src="{{getThemeAssetsPathWithDefault this 'img/banner-bottom-home-1.jpg'}}" />
				<div class="home-infoblock-text">{{translate 'Shop Now'}}</div>
			</a>
		</div>
		{{/each}}
	</div>
	{{/if}}

	<!-- CMS ZONE -->
    <div data-cms-area="home_cms_area_manor_3" data-cms-area-filters="path"></div>

	<!-- SECOND INFOBLOCKS -->
	{{#if extraHomeView.showInfoblocksMore}}
	<div class="home-infoblock-layout home-infoblock-layout-more">
		{{#each extraHomeView.infoBlocksMore}}
		<div class="home-infoblock">
			<a{{objectToAtrributes item}} class="home-infoblock-link">
				<img class="home-infoblock-image" src="{{#if image}}{{image}}{{else}}{{getThemeAssetsPath 'img/banner-bottom-home-1.jpg'}}{{/if}}" alt="{{title}}" />
				{{#if title}}<div class="home-infoblock-text">{{title}}</div>{{/if}}
			</a>
		</div>
		{{/each}}
	</div>
	{{/if}}

	<!-- Hero Banner -->
	{{#if extraHomeView.hero}}
	<div class="home-hero">
		<div class="home-hero-image"{{#if extraHomeView.hero.image}} style="background-image:url('{{extraHomeView.hero.image}}');"{{/if}}>{{#if extraHomeView.hero.image}}<img src="{{extraHomeView.hero.image}}" />{{/if}}</div>
		<div class="home-hero-text">
			{{#if extraHomeView.hero.text}}{{{extraHomeView.hero.text}}}{{/if}}
			{{#if extraHomeView.hero.linklocation}}
				<a href="{{extraHomeView.hero.linklocation}}">{{#if extraHomeView.hero.linktext}}{{extraHomeView.hero.linktext}}{{else}}{{translate 'Learn More'}}{{/if}}</a>
			{{/if}}
		</div>
	</div>
	{{/if}}

	<!-- CMS MERCHANDISING ZONE -->
    <div class="home-merchandizing-zone">
        <div class="home-merchandizing-zone-content">
            <div data-cms-area="home_merchandizing_zone" data-cms-area-filters="path"></div>
        </div>
    </div>

	<!-- CMS ZONE -->
	<div data-cms-area="home_cms_area_manor_7" data-cms-area-filters="path"></div>
</div>

{{!----
Use the following context variables when customizing this template:

	imageHomeSize (String)
	imageHomeSizeBottom (String)
	carouselImages (Array)
	bottomBannerImages (Array)

----}}
