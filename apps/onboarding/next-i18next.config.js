const path = require('path')

module.exports = {
  // Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  i18n: {
    locales: ['default', 'se', 'se-EN', 'no', 'no-EN', 'dk', 'dk-EN'],
    defaultLocale: 'default',
    localeDetection: false,
  },

  localePath: path.resolve('./public/locales'),
  localeStructure: '{lng}/{ns}',

  interpolation: {
    prefix: '{',
    suffix: '}',
  },
}
