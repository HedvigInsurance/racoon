// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const config = require('./.eslintrc')
// eslint-disable-next-line no-undef
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
