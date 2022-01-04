# Racoon | Hedvig Web UI Kit

This is the component library for the web design system at Hedvig.

The component library is deployed at: [https://hedviginsurance.github.io/racoon](https://hedviginsurance.github.io/racoon).

## Technical setup

The package is part of a monorepo using Yarn (v1) workspaces and enchanced by `turborepo`. `tsup` is used for compiling TypeScript and bundling.

## Using the package

Add a new dependency to your app/package in your `package.json`:

```json
{
  "dependencies": {
    "ui": "*"
  }
}
```

> You current cannot use this package unless the project is part of this monorepo.
