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

## VS Code extension: [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)

Requirements:

- Add `APOLLO_KEY` to `.env.local` (see Vercel)

## Using the Storyblok editor

To preview your Storyblok blocks that you have developed locally, use

```
<server url>/editor.html
```

by default:

```
http://localhost:8040/editor.html
```
