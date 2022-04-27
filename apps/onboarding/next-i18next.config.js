const I18NextHttpBackend = require('i18next-http-backend')

module.exports = {
  // Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  i18n: {
    locales: ['default', 'se', 'se-en', 'no', 'no-en', 'dk', 'dk-en'],
    defaultLocale: 'default',
    localeDetection: false,

    backend: {
      loadPath: `${process.env.TRANSLATIONS_URL}/{lng}/{ns}.json`,
    },
  },

  lowerCaseLng: true,

  interpolation: {
    prefix: '{',
    suffix: '}',
  },

  serializeConfig: false,
  use: [I18NextHttpBackend],
  ns: ['common'],
}
