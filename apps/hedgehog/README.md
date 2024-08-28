# Hope

## Local development

### Dependencies

- NVM: Not necessary, but highly recommended for installing different Node versions
  - [Install via brew](https://formulae.brew.sh/formula/nvm)
- Node version from .nvmrc:
```
    nvm install
    nvm use
  ```
- Yarn:
  - `npm install --global yarn`
 
### If you're using VSCode
Create a folder in the root called `.vscode` and place a file named `settings.json` in it.
An example of that file is shown here:
```
{
  "search.exclude": {
    "**/.yarn": true,
    "**/.pnp.*": true
  },
  "eslint.nodePath": ".yarn/sdks",
  "prettier.prettierPath": ".yarn/sdks/prettier/index.js",
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

##### Typescript server
- In settings.json, make sure you have this setting:
```
{
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
}
```
- Open the command palette (cmd+shift+p) and choose "TypeScript: Select TypeScript Version", it should be set to workspace version from the location `.yarn/sdks/typescript/lib`
- 
##### Prettier formatting
- Download and enable extension called `Prettier` and make sure default formatter is set to `Prettier - Code Formatter` in settings, prettier settings are already setup in package.json
- If you don't want to manually run the formatter, you can activate it to format on save.
<img width="1223" alt="image" src="https://github.com/HedvigInsurance/hedgehog/assets/33982429/e2a3c41c-ce53-4503-b19a-698657edeb71">

### Running

- Install project dependencies with `yarn install`
- Create a `.env` file, see `.env.example` for examples
- Run with
  - `yarn dev` if you want to connect to `back-office` in staging
  - `yarn dev:local` if you have `back-office` running locally

### Misc

- If you want to test raw queries, go to `http://localhost:9000/graphiql`

## Best practice

To facilitate development and maintenance, it is encouraged to use the opinionated directory
structure. Working on everyday tasks in Hope you will most likely only need to care about the following parts:

### `/src/@hedvig-ui`

If a component, hook or utility is generic it will most likely be found here. This package provides you with every
component you might ever need when you create new features, and they are all styled using the centralized theme.

It is crucial that everything in here is context independent. No use of GraphQL, no specific business logic. Think of
it like this; if we were to create a similar service as Hope, we should be able to extract this
package and be good-to-go without configuration.

### `/src/portals`

Here you'll find different subsets and tools of Hope. The primary system is `hope`.

### `/src/portals/*/pages`

Inspired by the file based routing system used in NextJS, this directory should be a 1-to-1-ish map of the routing
structure defined in `/src/pages/routes.ts`. Naming convention is to suffix with `Page`,
e.g. `DashboardPage` or `MemberPage`, and to export a component with the same name as the file. This makes it very easy to
navigate and search for pages.

Pages should be lightweight and render one or more _features_. Preferably, a page should only manage eventual routing
parameters and queries such that features can get the props they need.

### `/src/portals/*/common`

If you have a reusable hook or component with business logic, this is the place. They should be decoupled and
mountable by themselves.

### `/src/portals/*/features`

The point here is to isolate code into different chunks, or features, so different domains don't overlap. This makes
it easier to maintain the codebase, create new features, remove old features, and to promote loosely coupled features.

Preferably, a feature should be completely independent of other features. If there seems to be an overlap, don't be
afraid to restructure the features into sub-features so that they share a common top-level feature. An example could be:

```typescript
// Structure before. Perhaps claim-details and claim-list share some graphql queries and hooks?

/features
    /claim-details
    /claim-list
    /member-search
    /inbox
```

```typescript
// Structure after, utilizing sub-features

/features
    /claims
        /hooks
        /graphql
        /claim-list
        /claim-details

    /claim-list
    /member-search
    /inbox
```

The general structure for a feature is:

1. Gather its GraphQL queries in a directory named `graphql`
2. Gather its hooks in a directory named `hooks`, and use `.ts` extension if possible
   1. If not possible, ask yourself whether it's really a proper hook with only business logic
3. Gather feature-specific components under a `components` directory
4. If the feature contains sub-features, simply create a new directory where the name corresponds to the sub-feature
   1. Enforce these rules on a sub-feature as well.
   2. You may use the parents components, hooks or queries if it makes sense - the most important part is that the top-level feature is loosely coupled from other features.
5. Very often, a feature can be summarized in some sort of top-level component. This one should be at the top-level of the feature.

All in, a feature could look something like this

```
/features
    /user
        /components
          Panel.tsx
          UserListItem.tsx
          UserList.tsx

        /graphql
            get-me.graphql
            update-user.graphql
            update-user-settings.graphql
            users.graphql
            users-on-path.graphql

        /hooks
            use-authenticate.ts
            use-me.tsx

        UserPanel.tsx
```

When in doubt, just create a top-level feature and make sure it's not too coupled with any other feature. This makes it easy
to restructure later on.

## hedgehog, back-office, and schema.graphql

`back-office` and `hedgehog` share the `schema.graphql` file. When altering this file, it should be altered in
`back-office`. The contents of `back-office/schema.graphql` should then be copied to `hedgehog/schema.graphql`.
