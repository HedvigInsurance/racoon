# Racoon | Coverage Store

Hedvig Coverage Store.

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

## HTTP Headers

We use a few custom headers when communicating with the API. These are:

- `Hedvig-ShopSessionID`: The ID of the current shop session, used for debugging purposes.
- `Hedvig-Language`: Java Locale code (e.g. `ca-ES`), used for API localisation including error messages.
- `Authorization`: Bearer token for the currently authenticated user.
