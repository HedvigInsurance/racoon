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

## VS Code extension: [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)

Requirements:

- Add `APOLLO_KEY` to `.env.local` (see Vercel)

## Sharing Shop Session

It can be useful to share a shop session with someone. Perhaps you've got into a strange state and want to share the session with a colleague so you can debug together.

You do this by sending them a link:

```html
https://www.store.dev.hedvigit.com/{LOCALE}/session/{SHOP_SESSION_ID}?next={REDIRECT_URL}
```

You can optionally provide a `?next=/se/cart` query parameter with the relative link to route to redirect the user. By default, the user is redirected to the home page.

## Resetting current Shop Session

If you want to reset the current shop session, you can do so by visiting the following URL:

```html
/api/session/reset?next={REDIRECT_URL}
```
