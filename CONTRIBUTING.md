# Contributing

## Development guidelines

### Typescript

#### Code structuring

- We prefer `type` over `interface`
- Limit the use of `any`, always try to be explicit.

### File/Directory structure

This project follows Josh Comeau's [Delightful File/Directory Structure](https://www.joshwcomeau.com/react/file-structure) with the following exceptions:

- Skip `index.ts` files inside component folders
- Name hooks as `useThing.ts`
- Use PascalCase for React components and camelCase for all other files

#### General folder structure (Next.js workspace)

```text
├─ components/
│  ├─ Widget/
│  │  ├─ Widget.tsx             <-- main React component
│  │  ├─ Widget.stories.tsx     <-- Storybook file
│  │  ├─ WidgetChild.tsx        <-- sub-component
│  │  ├─ Widget.helpers.tsx     <-- component-level helper functions
│  │  ├─ Widget.constants.tsx   <-- component-level constants
│  │  ├─ useThing.tsx           <-- component-level hook
├─ helpers/
│  ├─ auth.helper.ts            <-- app-level helper function
├─ utils.ts                     <-- app-level generic functions like "lodash"
├─ hooks/
│  ├─ useBoop.ts                <-- app-level hook
├─ services/
│  ├─ i18n.ts                   <-- namespaced utilities related to "i18n"
├─ constants.ts                 <-- app-level constants
├─ types.ts                     <-- app-level types
├─ graphql                      <-- app-level types
│  ├─ Query.graphql             <-- GraphQL schema query/mutation/fragment
├─ pages/
│  ├─ about.ts                  <-- Next.js page component
```

#### Code styling

- Make use of object and array destructuring
- Respect the code style guidelines, `prettier` and `yarn lint` is everyone's best friend
- Don't use default exports as they lead to poor discoverability. Stick to named exports

## Commits & Branches

### Commits

### Branch names

We name our branches following this pattern:

`[Jira issue ID, if applicable]/[type]/[description]`

Example:

```
GRW-123/feat/add-modal-component
```

Prefixing the branch name with the issue number will link it to the ticket in Jira

#### Branch types

- `build`: Changes that affect the build system or external dependencies
- `chore`: Other changes that don’t modify src or test files
- `ci`: Changes to our CI configuration files and scripts
- `copy`: Copy update
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: Bug fixes
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Reverts a previous commit/PR
- `style`: Changes that do not affect the meaning of the code (white-space, formatting etc)
- `test`: Adding tests or correcting existing tests

## Pull Requests & Code Reviews

### Pull Requests

- Break down your work into small (easy to review) PRs!
- It’s your responsibility to get your PRs merged
- Try to pair program on complex tasks - then the PR review will be much easier
- If people are not reviewing your PR => reach out and suggest you can go over it together
- Use PR template to explain the What and Why of your code

### Code Reviews

Read the full PR & Code review guide in [Notion](https://www.notion.so/hedviginsurance/Pull-Requests-Code-Review-b7c1787988c944678b989de8a68c147a)

### Review apps

For every branch with an open PR there's the possibility to create a review app, to preview the changes in a deployed state.

This is a great way to make code review easier for your peers, and also if you need to sync regarding the changes with a none-coder, like a designer or stakeholder.

Read the [guide n Notion](https://www.notion.so/hedviginsurance/Review-apps-886358fb864d42f4b7dd66d49fd8aef4) on how you create a review app on Heroku

## Continuous Integration and Deployment

### Continuous Integration

All PR's and subsequent commits to a PR will trigger our CI build pipeline which will perform a range of checks, linting, build, etc. You will be notified in your PR if the build has failed.

### Deployment strategy

When a PR is merged to the main branch:

- `Market Web` will be deployed to `staging`, deployment to `production` is manual in Heroku
- `Web Onboarding` will be deployed to `staging`, deployment to `production` is manual in Heroku

## Useful links

- [Web Onboarding - Offer debugger](https://www.dev.hedvigit.com/se-en/new-member/offer-debugger)
- [Web Onboarding - Staging](https://www.dev.hedvigit.com/se-en/new-member)
- [Web Onboarding - Production](https://hedvig.com/se-en/new-member)
- [Market Web - Staging](https://www.dev.hedvigit.com/)
- [Market Web - Production](https://hedvig.com/)
- [Purchase Journey Hub](https://www.notion.so/hedviginsurance/Purchase-Journey-Hub-e21d772039fc4fed88d119c7c9e9dca6)
