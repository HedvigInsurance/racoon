# Racoon | Onboarding

Next.js-based web app supping the web-based onboarding.

> Supports only the Forever feature.

## Next.js

Routes inside the `pages` folder are identified by suffixes `.page.tsx` or `.next.tsx`. This enables us to add any other files which won't be registered as routes.

### Forever page

You can get to the forever page on two URLs: `/forever` and `/forever/:code`.

The first route is statically rendered on build-time since the only dynamic data are translations.

The second route contains an unknown dynamic segment and is hence server side rendered.

## Styling

The project uses Tailwind CSS. PostCSS is needed for Tailwind.

> The purpose of the POC is not to evaluate styling solution. Tailwind is used to quickly implement a working site.

## Emotion dependencies

Emotion is not setup for the project. However, the dependencies are needed to import colors from `@hedviginsurance/brand`.

## Crashlytics

Sentry is setup according to the official Next.js example. No further customisations have been made.

The `src/pages/_error.next.tsx` was automatically created by Sentry Wizard.

To get Sentry to work you need either a `.sentryclirc` file or set a `SENTRY_AUTH_TOKEN` environment variable.

## GraphQL

Apollo Client v3 is used to make API requests.

[GraphQL Code Generator](https://www.graphql-code-generator.com) is used to automatically generate Apollo Client hooks. The setup is configured in `./codegen.yml` and outputs a single module: `src/lib/generated-types.ts`.

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

### Cypress

[Cypress](https://www.cypress.io/) is a great tool to implement integration and E2E tests. All of its features and ways of working is beyond the scope of this README file so please refer to the [official documentation](https://docs.cypress.io/guides/overview/why-cypress) for more information about it.
In this project E2E test files should be placed inside `cypress/integration` folder. Please note that they need to incude `.spec` on their names.

You can run E2E tests using one of both commands:

- `yarn e2e`: run the NextJS application (`yarn dev`) followed by _Cypress_ in the interactive mode. In this mode you can visualize the execution of your tests in a real browser.
- `yarn e2e:headless`: run the NextJS application (`yarn dev`) followed by _Cypress_ in the headless mode. This mode is more suitable for CI/CD environments as it doesn't display the execution of your tests in a browser window.

## Internationalization (i18n)

The app uses the built-in [Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing) feature of Next.js.

### Geo-redirects

We perform automatic geo-redirects using a global [middleware](https://nextjs.org/docs/middleware) `src/pages/_middleware.next.ts`. The `default` locale corresponds to URLs without any locale included. However, we don't support that so users are always redirected to a URL with an [prefixed locale](https://github.com/vercel/next.js/discussions/18419#discussioncomment-1561577).

### Translations

The app is also setup to use [i18next](https://www.i18next.com) which provides support for loading and working with translations.

> Something in the setup is causing the locale characters after the dash `-` to be transformed into upper case like `se-en => se-EN` when building the site. Since the file system is case sensitive (at least Mac) this requires us to name our locale folders in the same way. It's possble to use lower case locales in the URL (it's case insensitive), however, navigating between pages will convert to the upper case version. Another option without this issue could be [next-multilingual](https://github.com/Avansai/next-multilingual).

Translation files are stored in `public/locales` and can be fetched by running:

```bash
yarn download-translations
```

> This command requires a `LOKALISE_API_KEY` environment variable.

## Tracking

Google Tag Manager is setup according to the [official example](https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager).

The Adtraction script is include in `src/pages/_app.next.tsx`.
