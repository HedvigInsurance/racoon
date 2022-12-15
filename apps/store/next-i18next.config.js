const englishFallback = ['default']

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // 1. Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  // 2. Keep in sync with other places locales are configured
  // - scr/lib/l10n/locales.ts
  // - Storyblok folder slugs
  // - Dictionaries download script
  i18n: {
    locales: ['default', 'se', 'sv-se', 'en-se', 'dk', 'en-dk', 'no', 'en-no'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  fallbackLng: {
    'en-se': englishFallback,
    'en-dk': englishFallback,
    'en-no': englishFallback,
    // We're using 'se' for Swedish, but in ISO registry it stands for Northern Sami
    // This alias is a workaround that allows us to have correct plural forms
    //
    // Same workaround would be needed if
    // - any of short routing locales would match real language with non-default plural forms
    // - any of default languages in new countries would have non-default plural forms
    se: ['sv-se'],
  },
  fallbackNS: 'common',
  localePath:
    typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  lowerCaseLng: true,
}
