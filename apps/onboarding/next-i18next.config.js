const path = require('path')

module.exports = {
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
