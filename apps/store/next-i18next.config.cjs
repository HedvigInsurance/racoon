const path = require('path')

const englishFallback = ['en']

// GOTCHA: This file has to stay .js or next-i18next will fail during Vercel build
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
      // Generic English with optional country-specific variants (those generally should be empty)
      'en',
      'dk-en',
      'no-en',
      'se-en',

      // Swedish, see note in fallbackLng
      'se',
      'sv-se',
      // Everything else
      'dk',
      'no',
    ],
    defaultLocale: 'en',
    localeDetection: false,
  },
  fallbackLng: {
    // Need explicit fallbacks, locale loading fails with nonExplicitSupportedLngs: true,
    'se-en': englishFallback,
    'dk-en': englishFallback,
    'no-en': englishFallback,
    // We're using 'se' for Swedish, but in ISO registry it stands for Northern Sami
    // This alias is a workaround that allows us to have correct plural forms
    //
    // Same workaround would be needed if
    // - any of short routing locales would match real language with non-default plural forms
    // - any of default languages in new countries would have non-default plural forms
    se: ['sv-se'],
  },
  fallbackNS: 'common',
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',
  lowerCaseLng: true,
}
