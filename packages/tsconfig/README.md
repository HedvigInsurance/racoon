# Racoon | `tsconfig`

Package with shared `tsconfig.json` files. Making changes to this may have unintended consequences.

## Using the package

Add a new dependency to your app/package in your `package.json`:

```json
{
  "devDependencies": {
    "tsconfig": "*"
  }
}
```

> You current cannot use this package unless the project is part of this monorepo.

Create a `tsconfig.json` file in the project root:

```json
{
  "extends": "tsconfig/react-library.json"
}
```
