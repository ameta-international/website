<section class="product-reviews-center-content">
	<div class="product-reviews-center-more-info-content-container">
		<div class="product-reviews-center">
			<h2 class="product-reviews-center-container-header-title">{{translate 'Ratings &amp; Reviews'}}</h2>
			{{#if itemCount}}
				<div data-view="ListHeader.View"></div>

				<div class="product-reviews-center-container">
					<div class="product-reviews-center-container-header">
						<h2 class="product-reviews-center-container-header-number">
							{{#if hasOneReview}}
								{{translate '1 Review'}}
							{{else}}
								{{translate '$(0) Reviews' itemCount}}
							{{/if}}
						</h2>
						<div data-view="Global.StarRating"></div>
					</div>
					<div class="product-reviews-center-container-wrapper">
						<div data-view="Global.RatingByStar"></div>
					</div>
				</div>

				<section class="product-reviews-center-list">
					{{#if totalRecords}}
						<div data-view="ProductReviews.Review" class="product-reviews-center-review-container"></div>
					{{else}}
						{{translate 'There are no reviews available for your selection'}}
					{{/if}}
				</section>

				<div class="product-reviews-center-footer">
					<div data-view="GlobalViews.Pagination"></div>
				</div>

				<div class="product-reviews-center-container-footer">
					<a href="{{itemUrl}}/newReview" class="product-reviews-center-container-footer-button">{{translate 'Write a Review'}}</a>
				</div>
			{{else}}
				<!-- <div class="product-reviews-center-container"> -->
					<div class="product-reviews-center-no-reviews-container">
						<h2 class="product-reviews-center-no-reviews">{{translate 'No reviews available'}}</h2>
						<p>{{translate 'Be the first to'}} <a href="{{itemUrl}}/newReview" class="product-reviews-center-container-button">{{translate 'Write a Review'}}</a></p>
					</div>
				<!-- </div> -->
			{{/if}}
		</div>
	</div>
</section>



{{!----
Use the following context variables when customizing this template:

	itemCount (Number)
	hasOneReview (Boolean)
	itemUrl (String)
	totalRecords (Number)

----}}
