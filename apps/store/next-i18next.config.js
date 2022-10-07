const path = require('path')

const englishFallback = ['default']

module.exports = {
  // 1. Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  // 2. Keep in sync with other places locales are configured
  // - scr/lib/l10n/locales.ts
  // - Storyblok folder slugs
  // - Dictionaries download script
  i18n: {
    locales: ['default', 'se', 'en-se', 'dk', 'en-dk', 'no', 'en-no'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  fallbackLng: {
    'en-se': englishFallback,
    'en-dk': englishFallback,
    'en-no': englishFallback,
  },
  fallbackNS: 'common',
  localePath: path.resolve('./public/locales'),
  localeStructure: '{lng}/{ns}',
  lowerCaseLng: true,
  interpolation: {
    prefix: '{',
    suffix: '}',
  },
}
