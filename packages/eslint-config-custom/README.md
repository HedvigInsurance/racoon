# Racoon | eslint-config-custom

Package with shared ESLint config.

## Using the package

Add a new dependency to your app/package in your `package.json`:

```json
{
  "devDependencies": {
    "eslint-config-custom": "workspace:"
  }
}
```

> You can only use this package as part of this monorepo.

Create a `.eslintrc.js` file in the workspace root and extend this config:

```js
module.exports = {
  extends: ['custom'],
}
```
