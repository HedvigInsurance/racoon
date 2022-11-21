const path = require('path')

module.exports = {
  // Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  i18n: {
    locales: ['default', 'se', 'se-en', 'no', 'no-en', 'dk', 'dk-en'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  fallbackNS: 'common',
  localePath: path.resolve('./public/locales'),
  lowerCaseLng: true,
}
