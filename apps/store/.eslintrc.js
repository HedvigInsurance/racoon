// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('scripts/eslint-preset-next')
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // This allows us to use to auto-focus attribute on input elements (or all elements, really)
    // It's used for the accordion effects in PriceForm. Without auto-focus user would have to tab
    // through the entire page to get to the newly shown form items, which is worse than messing
    // with auto-focus. Probably.
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-autofocus.md
    'jsx-a11y/no-autofocus': [0],
  },
}
