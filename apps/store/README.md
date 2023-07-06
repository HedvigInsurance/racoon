# Racoon | Coverage Store

Hedvig Coverage Store.

## Storyblok

Storyblok is the CMS we use for editors to edit the content (text, images, videos, etc) on hedvig.com. Storyblok is a headless, modular CMS where you build pages with blocks.

The schema for blocks are defined in the Storyblok UI and corresponds to a component implementation in `src/blocks`.

For a more detailed guide check the page in [Notion](https://www.notion.so/hedviginsurance/Working-with-Storyblok-9e2e681802384729ad3d5b0a184756b2)

### Media

Images are uploaded and managed in Storyblok. Videos are uploaded to our S3 bucket `cdn.hedvig.com/hedvig-dot-com`. This is to save traffic usage and cost from Storyblok.

## Translations

Translations are store under `public/locales`. They can be downloaded by running:

```bash
yarn workspace store download-translations
```

Requirements:

- [lokalise2 CLI](https://github.com/lokalise/lokalise-cli-2-go)
- `LOKALISE_TOKEN` environment variable (not loaded automatically from `.env`)

### Debugging

To know which text key is used where you can suffix the url anywhere with `?debug=textkeys` to show text keys instead of translations, and to disable
the debug mode you can suffix the url with `?debug=none`.

It's also possible to display the current Shop Session ID by suffixing the url with `?debug=session`.

## VS Code extension: [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)

Requirements:

- Add `APOLLO_KEY` to `.env.local` (see Vercel)

## Share / Resume a Shop Session

It can be useful to share a shop session with someone. Perhaps you've got into a strange state and want to share the session with a colleague so you can debug together.

You do this by sending them a link: `/{LOCALE}/session/{SHOP_SESSION_ID}`

Optional query parameters:

- `?next={REDIRECT_URL}`: Relative URL to redirect to (default: home page)
- `?code={CAMPAIGN_CODE}`: Set a campaign code for the session
- `?price_intent_id={UUID}`: Resume the price intent and navigate to the related product page

## Reset current Shop Session

If you want to reset the current shop session, you can do so by visiting the following URL:

```html
/api/session/reset?next={REDIRECT_URL}
```

## Create new Shop Session with entries

If you want to create a new shop session with entries, you can do so by visiting the following URL:

```html
/api/session/create
```

It will setup a shop session with two products: `SE_APARTMENT_RENT` and `SE_ACCIDENT`.

Optional query parameters:

- `?ssn={SSN}`: Swedish personal identity number

> **Note**
> This endpoint only supports Sweden for now.

## Attach a campaign code

You can attach a campaign code to the current (or new) shop session by using the following URL:

```html
/api/campaign/{CAMPAIGN_CODE}?next={REDIRECT_URL}
```

The `next` query parameter is required. When creating a new shop session, we base the country code on the locale from the `next` URL.

## Create an authenticated session

You can create an authenticated session by visiting the following URL:

```html
/api/auth/exchange/{AUTHORIZATION_CODE}?next={REDIRECT_URL}
```

The `next` query parameter is required.

## Feature Flags

Feature flags are used to enable/disable features in the app. They are stored in `/src/services/Flags`. Currenyly, we define all flags in code. In the future, we might want to move them to a 3rd party service.

You enable a feature flag by supplying the `NEXT_PUBLIC_FEATURE_XXX` environment variable. For example, to enable the `INSURELY` feature, you would set the `NEXT_PUBLIC_FEATURE_INSURELY=true`.

## Analyze bundle

To analyze bundle size run the following command and this will open a report in the browser

```bash
yarn workspace store analyze-bundle
```

## Experiments / A/B testing

> **Note**
> The current implementation is based on the official [A/B Testing with Google Optimize](https://vercel.com/templates/next.js/ab-testing-google-optimize) example.

We use Google Optimize for A/B testing. Experiments are defined in the Google Optimize UI. An experiment compares different variants of a single page/slug. For example, `/se` vs `/se/variant-1` vs `/se/variant-2`. The corresponding pages need to be published in the CMS (Storyblok).

Restrictions:

- One experiement can be run at a time
- One or more variants can be defined per experiment

To enable an experiment, do the following:

- Add the experiment ID to the `NEXT_PUBLIC_EXPERIMENT_ID` environment variable.
- Update relevant information in the `src/services/Tracking/experiment.constants.ts` file.

> **Note**
> Google Optimize will no longer be available after September 30, 2023.

## HTTP Headers

We use a few custom headers when communicating with the API. These are:

- `Hedvig-ShopSessionID`: The ID of the current shop session, used for debugging purposes.
- `Hedvig-Language`: Java Locale code (e.g. `ca-ES`), used for API localisation including error messages.
- `Authorization`: Bearer token for the currently authenticated user.
