const config = require('./.eslintrc')
module.exports = {
  ...config,
  extends: [...config.extends, 'next/core-web-vitals'],
  settings: {
    ...config.settings,
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
}
