const config = require('./.eslintrc')
module.exports = {
  ...config,
  extends: [...config.extends, 'plugin:jsx-a11y/recommended'],
  plugins: [...config.plugins, 'jsx-a11y'],
}
