# Contributing

This document contains guidelines for how we write, organize and collaborate on our code.

## Table of contents

- [Web standards](#web-standards-and-accessibility)
- [Solving problems](#solving-problems)
- [File and Directory structure](#file-and-directory-structure)
- [Commits and Branches](#commits-and-branches)
- [Pull Requests and Code Reviews](#pull-requests-and-code-reviews)
- [Continuous Integration and Deployment](#continuous-integration-and-deployment)
- [Code guidelines](#code-guidelines)
- [Storyblok](#storyblok)
- [Useful links](#useful-links)

## Web standards and Accessibility

One of our design principles is "Be inclusive". This means we should build accessible web sites. The easiest way to achieve this is to stay close to standards and write semantic HTML.

No matter what, the end goal is **predictable web behaviour**. It should not matter which device, input method, or assistive technology a user uses to access our sites.

## Solving problems

There's no platform we would rather develop for than the web. Therefore we approach problems using this approach:

1. Use built-in web/browser solutions. How far can we get? (`<select>`, `<form>`)

1. Use custom but W3C/WCAG compliant (probably 3rd party) solution (`<form>` + `event.preventDefault()`)

1. Explore a custom solution (Embark)

## File and Directory structure

This project follows Josh Comeau's [Delightful File/Directory Structure](https://www.joshwcomeau.com/react/file-structure) with the following exceptions:

- Skip `index.ts` files inside component folders
- Name hooks as `useThing.ts`
- Use PascalCase for React components and camelCase for all other files

### General folder structure (Next.js workspace)

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
├─ features/
│  ├─ blog/                     <-- app-level features
├─ constants.ts                 <-- app-level constants
├─ types.ts                     <-- app-level types
├─ graphql                      <-- app-level types
│  ├─ Query.graphql             <-- GraphQL schema query/mutation/fragment
├─ pages/
│  ├─ about.ts                  <-- Next.js page component
```

### Feature-folders

We've made one addition to the directory structure suggested by Josh Comeau. We've added a `features` folder. Josh makes some good points why grouping modules into features can be a bad idea. However, we've found that in some limited cases it's a very powerful concept.

When starting a new project, consider if it could fit as a separate feature. Optimize for **clean feature** versus cramming everthing into feature-folders.

You can tell that a set of modules work as a feature if they:

- Share common business logic

- Often change together (a change in one file often requires a change in another file)

- Represent a standalone concept (can be easily deleteled and feature-flagged)

  - Never import modules from one feature into another

A feature is not:

- A page or route (they are already grouped together in the `/pages` folder)

- A component (use the `/components` folder if all your need is to group React components)

- An API wrapper around e.g. Storyblok or Insurely (use the `/services` folder)

#### Next.js-layer

Aim to contain all Next.js specific logic under the `/pages` folder. This means that we should build things under e.g. `/components` in a way so they could be copied over to a non-Next.js based project without major changes.

Examples:

- Handle `req`, `res`, `context` objects directly inside `/pages`
- Manage cookies inside `/pages`
- Manage `<Head>` and meta-tags inside `/pages`
- Style components inside `/components`

Exceptions:

- `useRouter`, `<Image>`, and other are used throughout the project.

## Commits and Branches

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

## Pull Requests and Code Reviews

### Pull Requests

- Break down your work into small (easy to review) PRs!
- It’s your responsibility to get your PRs merged
- Try to pair program on complex tasks - then the PR review will be much easier
- If people are not reviewing your PR => reach out and suggest you can go over it together
- Use PR template to explain the What and Why of your code

### Code Reviews

Read the full PR & Code review guide in [Notion](https://www.notion.so/hedviginsurance/Pull-Requests-Code-Review-b7c1787988c944678b989de8a68c147a)

### Preview deployments

A preview deployment will be created for each open PR. They are configured in the same way as the staging environment.

This is the main way to review that the code is working before merging into `main` and making a production deploy. You can also share the link with other stakeholders like designers to review your work.

## Continuous Integration and Deployment

### Continuous Integration

All PR's and subsequent commits to a PR will trigger our CI build pipeline which will perform a range of checks, linting, build, etc. You will be notified in your PR if the build has failed.

### Deployment strategy

When a PR is merged to the `main` branch it will be automatically deployed to production.

## Code guidelines

- Make use of object and array destructuring
- Respect the code style guidelines, `prettier` and `yarn lint` is everyone's best friend

### Exports

Don't use default exports as they lead to poor discoverability. Stick to named exports.

```tsx
// Do:

export const DynamicComponent = () => {
  // ...
}
```

```tsx
// Don't:

const DynamicComponent = () => {
  // ...
}

export default DynamicComponent
```

### Imports

We don't import types directly from `'react'` - i.e. we don't desctructure them in the import statement.
The reason for this is that the types from React are not always named in a way that makes super clear that's where they come from.

```tsx
// Do:

import React, { useState, useEffect } from 'react'

/* ... */

export const DoSomething: React.ReactNode = () => {
  /* ... */
}
```

```tsx
// Don't:

import React, { useState, useEffect, ReactNode } from 'react'

/* ... */

export const DoSomething: ReactNode = () => {
  /* ... */
}
```

### Components

#### Components in files

As stated in the section on Files the rule of thumb is pretty easy - **one React component per file**. And the component exported from a file **should be named the same as the file**.

#### Declaring components

When declaring components we use anonymous arrow functions, and not the `function` keyword.

```tsx
// Do:

export const Component = () => {
  // ...
}
```

```tsx
// Don't:

export function Component() {
  // ...
}
```

#### Component size

Our React components should be easy to get an overview of, which means that their returned JSX "markup" _ideally_ fits on the screen of a 15/16 inch laptop without you having to scroll. If it's bigger than that you should probably look into splitting it up into smaller components. If you feel like you can't then you should most likely do some refactoring :)

### Props

#### Receiving props

We always destructure props in the component **receiving** them.

```tsx
// Do:

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <>
      <div>{prop1}</div>
      <div>{prop2}</div>
    </>
  )
}

const MyComponent = ({ prop1, ...rest }) => {
  return (
    <>
      <div>{prop1}</div>
      <MyOtherComponent {...rest} />
    </>
  )
}
```

```tsx
// Don't:

const MyComponent = (props) => {
  return (
    <>
      <div>{props.prop1}</div>
      <div>{props.prop2}</div>
    </>
  )
}
```

#### Passing props

We only spread props when **passing** them if we want to pass an unknown number of props. Otherwise we don't spread them, even if there are many of them and they're called the same in the receiving component as in the one passing them.

```tsx
// Do:

<MyComponent prop1={prop1} prop2={prop2} prop3={prop3} />

<MyComponent {...unknownNumberOfProps} />
```

```tsx
// Don't:

<MyComponent {...{ prop1, prop2, prop3 }} />
```

#### Typing props

The pattern we _have previously been_ following and is the dominating one in our codebases is typing the return type of our components with the `React.FC` and typing the props like `React.FC<Props>`.

This pattern, however, is now discouraged (see the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/)), and we're gradually moving to typing our props in the way you usually type function parameters. All new components we write should follow the pattern below, and all old components you edit should also be edited to follow this pattern.

```tsx
// Do:

export const Component = ({ prop1, prop2 }: Props) => {
  // ...
}
```

```tsx
// Don't:

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // ...
}
```

Also, we prefer `type` aliases for props to inline typing

```tsx
// Do:

type Props = {
  prop1: string
  prop2: number
}

export const Component = ({ prop1, prop2 }: Props) => {
  // ...
}
```

```tsx
// Don't:

export const Component = ({ prop1, prop2 }: { prop1: string; prop2: number }) => {
  // ...
}
```

### Deprecating functions

If a function should no longer be used, but it doesn't make sense to replace it everywhere at the moment, it should be marked as `@deprecated` with a [JSDoc comment](https://jsdoc.app/tags-deprecated.html):

```tsx
/**
 * @deprecated This function should not be used, use newFunction instead.
 */
export const oldFunction = () => {
  //...
}
```

### Naming

Variables, including parameters, should have descriptive names. I.e. avoid naming things `x` or `a` (or e.g. `T` in the case of type variables for generics).

```tsx
// Do:

quotes.map((quote, index) => {
  // ...
})
```

```tsx
// Don't:

quotes.map((x, i) => {
  // ...
})
```

### Boolean variables

Boolean values starts with `is` or `has`. In special cases `should` or `can` is fine.

```tsx
// Do:

const isOpen = true

const hasData = false

// Ok:

const shouldUpdate = true

const canRedirect = false
```

```tsx
// Don't:

const open = true

const data = false
```

For more in-depth inspiration see [this blogpost](https://dev.to/michi/tips-on-naming-boolean-variables-cleaner-code-35ig). 👈

### Functions

Function names start with a verb since they _do_ stuff.

```tsx
// Do:

const getData = () => {}

const handleClick = () => {}
```

```tsx
// Don't:

const data = () => {}

const clickHandler = () => {}
```

### Event handler functions

Names of functions that handle events (like clicks) starts with the word "handle".

Exceptions are when the event only should trigger a change of state, i.e. call a _setSomeAwesomeState_ function, then it's perfectly fine to just call that function immediately.

```tsx
// Do:

onClick={(event) => handleClick(event)}

onClick={() => handleOpenModal()}

onClick={() => setIsModalOpen(true)}
```

```tsx
// Ok:

onClick={(event) => onClick(event)}

onClick={() => onOpenModal()}
```

```tsx
// Don't:

onClick={(event) => click(event)}

onClick={() => openModal()}
```

### Types

All types used in a file are declared at the top of the file, just below the imports. Since types are often imported anyways, which means they're not declared where they are used, it makes sense to just gather all of them there. But name them well (as you should with everything you name) - it's nice to get a grasp of what they're used for by just looking at them!

_Alternative rule:_

Types are declared as close to where they are used as possible. For example, a `type` alias listing the props of a component should be declared just above that component.

#### Avoid `any`

Limit the use of `any`, always try to be explicit.

```tsx
// Do: explicit

const sum = (a: number, b: number): number => a + b
```

```tsx
// Do: implicit

const sum = (a: number, b: number) => a + b
```

```tsx
// Don't:

const sum = (a: number, b: number): any => a + b
```

#### `type` vs `interface`

We use `type` to type over `interface`, especially for props. [Here is a short note](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#types-or-interfaces) on that matter, from a React-TypeScript cheatsheet that is linked to from the official TypeScript docs.

```tsx
// Do:

type Props = {
  prop: string
  isProp: boolean
}
```

```tsx
// Don't:

interface Props {
  prop: string
  isProp: boolean
}
```

### Styling

We use [Emotion](https://emotion.sh/docs/introduction) to style our components, which is pretty much like [Styled Components](https://styled-components.com/) with one difference being that you get types out of the box.

```tsx
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
```

```tsx
// Do:

// regular div
const CoolDiv = styled.div({
  background: 'peachpuff',
  width: '100%',
})

// div with props (props sould be destructured)
const DivWithProps = styled.div<{ isPurple: boolean }>(({ isPurple }) => {
  background: isPurple ? 'lavendar' : 'peachpuff'
})
```

```tsx
// Don't:

const NotSoCoolDiv = styled('div')`
  background: peachpuff;
`

const AnotherNotCoolDiv = styled.div`
  background: peachpuff;
`
```

### Responsive design

Customizing markup for different viewports often causes issues with SSR and re-hydration. Therefore, we render all markup needed (sometimes duplicate) and hide/show relevant content using CSS.

## Storyblok

Our CMS.

### Allowing only specific nested blocks

In some cases we only support a single nested block type for a certain field. The `Accordion`-block has an "items" field that only supports `AccordionItem`-blocks.

Always do the following:

- Storyblok: use the "Allow only specific component to be inserted"
- React: filter out unsupported blocks by using the "component"-field
- React: explicitly use the block-component instead of `<StoryblokComponent>`

Do:

```javascript
export const AccordionBlock = ({ blok }: Props) => {
  const items = blok.items.filter((block) => block.component === 'accordionItem')

  return (
    <div>
      {blok.items.map((nestedBlock) => (
        <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </div>
  )
}
```

## Useful links

- [Web Onboarding - Offer debugger](https://www.dev.hedvigit.com/se-en/new-member/offer-debugger)
- [Web Onboarding - Staging](https://www.dev.hedvigit.com/se-en/new-member)
- [Web Onboarding - Production](https://hedvig.com/se-en/new-member)
- [Market Web - Staging](https://www.dev.hedvigit.com/)
- [Market Web - Production](https://hedvig.com/)
- [Purchase Journey Hub](https://www.notion.so/hedviginsurance/Purchase-Journey-Hub-e21d772039fc4fed88d119c7c9e9dca6)
