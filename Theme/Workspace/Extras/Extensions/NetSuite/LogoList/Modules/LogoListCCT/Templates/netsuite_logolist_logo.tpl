<div class="logolistcct-logo-container">
    <div class="logolistcct-logo-img-container">
        {{#if hasLink}}<a href="{{link}}" target="{{target}}">{{/if}}
            <img class="logolistcct-logo-img" src="{{image}}" alt="{{alt}}"  title="{{title}}" />
        {{#if hasLink}}</a>{{/if}}
    </div>
    <div class="logolistcct-logo-label">{{#if hasLabel}}<p>{{#if hasLink}}<a href="{{link}}" target="{{target}}">{{/if}}{{label}}{{#if hasLink}}</a>{{/if}}</p>{{/if}}</div>
</div>