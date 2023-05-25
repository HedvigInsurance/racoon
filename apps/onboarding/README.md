# Racoon | Onboarding

Next.js-based web app supping the web-based onboarding.

## Next.js

Routes inside the `pages` folder are identified by suffixes `.page.tsx` or `.next.tsx`. This enables us to add any other files which won't be registered as routes.

### Forever page

You can get to the forever page on two URLs: `/forever` and `/forever/:code`.

The first route is statically rendered on build-time since the only dynamic data are translations.

The second route contains an unknown dynamic segment and is hence server side rendered.

## Styling

The project uses Emotion.

Caveat: To enable the [`css` prop](https://emotion.sh/docs/css-prop) we need to opt out of SWC. I believe we should hold out until Next adds [official support](https://github.com/vercel/next.js/issues/30804).

## GraphQL

Apollo Client v3 is used to make API requests.

[GraphQL Code Generator](https://www.graphql-code-generator.com) is used to automatically generate Apollo Client hooks. The setup is configured in `./codegen.yml` and outputs a single module: `src/services/apollo/types.ts`.

You trigger the code generator using:

```bash
yarn codegen
```

## Developing with Mocked API

[Mock Service Worker](https://mswjs.io/) is an API mocking library for browser and Node. It provides seamless mocking by interception of actual requests on the network level using Service Worker API. This makes your application unaware of any mocking being at place.

### Enable/Disable API Mocking

To enable/disable mocking, all you have to do is add `NEXT_PUBLIC_API_MOCKING=[enabled|disabled]` into `.env.development` file and run the app on development mode - `yarn dev`. Not defining a `NEXT_PUBLIC_API_MOCKING` key will result on disabling API mocking.

### How to define mocks

Information about how to define mocks can be found [here](https://mswjs.io/docs/getting-started/mocks).

## Testing

### Jest

You can use [Jest](https://jestjs.io/) + [testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) to write unit tests. When doing so, make sure to get test utilities from `@lib/test-utils.tsx` file. Additionally, test files that are suppose to be ran with Jest should include `.test` on their names: E.g: `my-component.test.tsx`. In a regular setup, Jest also consider files that include `.spec` but that was removed from this project since `.spec` files specifies E2E test files. More info about this is in the next section.

To run unit tests, execute the command `yarn test`.

## Internationalization (i18n)

The app uses the built-in [Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing) feature of Next.js.

### Debugging

To know which text key is used where you can suffix the url anywhere with `?debug=textkeys` to show text keys instead of translations, and to disable the debug mode you can suffix the url with `?debug=none`.

### Geo-redirects

We perform automatic geo-redirects using a global [middleware](https://nextjs.org/docs/middleware) `src/pages/_middleware.next.ts`. The `default` locale corresponds to URLs without any locale included. However, we don't support that so users are always redirected to a URL with an [prefixed locale](https://github.com/vercel/next.js/discussions/18419#discussioncomment-1561577).

### Translations

The app is also setup to use [i18next](https://www.i18next.com) which provides support for loading and working with translations.

Translation files are stored in `public/locales` and can be fetched by running:

```bash
yarn download-translations
```

> This command requires a `LOKALISE_API_KEY` environment variable.

## Tracking

Google Tag Manager is setup according to the [official example](https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager).

The Adtraction script is include in `src/pages/_app.next.tsx`.

## `blurDataURL`

Some image component accept a `blurDataURL` prop. This is a [Next.js feature](https://nextjs.org/docs/api-reference/next/image#blurdataurl) that enables you to show a placeholder image before the `src`image successfully loads.

You can generate a BlurHash string for a given image by uploading it to the [Blurha.sh](https://blurha.sh/) website.
