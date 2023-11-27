# Hedvig Widget

Embeddable purchase flows used by integrating partners. It's intended to be used as an iframe, launched inside a mobile webview, or as a standalone web app. It represents a linear purchase flow and is limited to calculating the price of a single product.

## Architecture

The widget is built around the same concepts as the rest of the site. However, it doesn't use either of the Shop Session or Price Intent contexts. Instead it refers to these enteties directly in the URL.

The widget also makes use of SSR to render the pages in the flow.

## Landing Page (optional)

Any CMS page can act as a landing page for the widget. The only requirement is to include a link to a _Widget Flow_. Multiple landing pages can link to the same _Widget Flow_.

## Widget Flow

The _Widget Flow_ is represented by a Storyblok story of type `WidgetFlow`. It's used to configure a widget flow and to define the initial route.

You initialize the widget by going to the initial route of the flow. Given a _Widget Flow_ with the slug `se/widget/flows/avy` you would go to `https://www.hedvig.com/se/widget/flows/avy`.

This will create a new _Partner Shop Session_ and redirect to the next step in the flow.

### Optional query parameters

It's possible to pass query parameters to the initial route to pre-fill information in the shop session / price intent.

## Select Product Step

This step lets the user select a option from the list of products defined in the _Widget Flow_. The selected product is used to create a _Price Intent_. The user is then redirected to the `Calculate Price` step.

### Bypass the Select Product step

The Widget will skip this step in two cases:

1. There is only one product defined in the _Widget Flow_

1. The `productType` query parameter is passed to the initial route

## Calculate Price Step

This step renders a `Price Calculator` based on the product selected in the previous step. At the end of the step the user is redirected to the _Sign_ step.

## Sign Step

This step renders a version of a "checkout" page. It's possible to configure whether to display offer recommendations or not in the _Widget Flow_. The user is redirected to the next step after signing.

## Payment Step

This step renders the Trustly widget. The user is redirected to the next step after completing the payment.

## Confirmation Step

This step renders a custom "confirmation" page. This is the end of the flow.

## Testing

- "Hedvig Embedded" can be tested in the [iframe simulator](http://localhost:8040/se/debugger/iframe). It runs the widget in an iframe while listing all the post messages sent to the parent window.

- "Hedvig Included" can be tested by first visiting the [Trial Contract Debugger](http://localhost:8040/se/debugger/trial). After creating a trial contract, you will be redirected to the widget.
