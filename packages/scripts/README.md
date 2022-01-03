# Racoon | Scripts

Package with shared ESLint preset.

## Using the package

Add a new dependency to your app/package in your `package.json`:

```json
{
  "devDependencies": {
    "scripts": "*"
  }
}
```

> You current cannot use this package unless the project is part of this monorepo.

Create a `.eslintrc.js` file in the project root and include this package:

```js
module.exports = require('scripts/eslint-preset')
```
