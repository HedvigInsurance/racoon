const path = require('path')

module.exports = {
  // Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  i18n: {
    locales: ['default', 'sv-SE', 'en-SE', 'nb-NO', 'en-NO', 'da-DK', 'en-DK'],
    defaultLocale: 'default',
    localeDetection: false,
  },

  localePath: path.resolve('./public/locales'),
  localeStructure: '{lng}/{ns}',
  lowerCaseLng: true,
  interpolation: {
    prefix: '{',
    suffix: '}',
  },
}
