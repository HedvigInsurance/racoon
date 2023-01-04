const englishFallback = ['en']

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // Noisy, but may be useful for debugging i18n issues
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // 1. Include "default" to prefix the default locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  // 2. Keep in sync with other places locales are configured
  // - scr/lib/l10n/locales.ts
  // - Storyblok folder slugs
  // - Dictionaries download script
  i18n: {
    locales: [
      // Technical value for "locale not selected", see https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
      'default',
      // Generic English with optional country-specific variants (generally should be empty)
      'en',
      'en-dk',
      'en-no',
      'en-se',
      // Swedish, see note in fallbackLng
      'se',
      'sv-se',
      // Everything else
      'dk',
      'no',
    ],
    defaultLocale: 'default',
    localeDetection: false,
  },
  fallbackLng: {
    // Only used in country selector page
    default: englishFallback,
    // Need explicit fallbacks, locale loading fails with nonExplicitSupportedLngs: true,
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
