import { locales } from '@/lib/l10n/locales'
import { Locale, MarketLabel } from '@/lib/l10n/types'

export const TEMP_TRANSLATIONS: Record<string, string> = {
  MARKET_LABEL_SE: 'Sweden',
  MARKET_LABEL_NO: 'Norway',
  MARKET_LABEL_DK: 'Denmark',

  LANGUAGE_LABEL_sv: 'Swedish',
  LANGUAGE_LABEL_en: 'English',
  LANGUAGE_LABEL_no: 'Norwegian',
  LANGUAGE_LABEL_da: 'Danish',
}

export const MARKET_MAP = Object.values(locales).reduce((markets, { marketLabel, htmlLang }) => {
  if (marketLabel in markets) {
    return { ...markets, [marketLabel]: [...markets[marketLabel], htmlLang] }
  }
  return { ...markets, [marketLabel]: [htmlLang] }
}, {} as Record<MarketLabel, Array<Locale>>)

export enum Field {
  Market = 'market',
  Language = 'language',
}

export const SECTIONS = [
  {
    title: 'Our insurances',
    links: [
      { title: 'Hedvig Home', href: '/products/home' },
      { title: 'Hedvig House', href: '/products/house' },
      { title: 'Hedvig Car', href: '/products/car' },
      { title: 'Hedvig Accident', href: '/products/accident' },
      { title: 'Hedvig Travel', href: '/products/travel' },
      { title: 'Hedvig Student', href: '/products/home-student' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'Our story', href: '/story' },
      { title: 'The Hedvig app', href: '/app' },
      { title: 'Claims', href: '/claims' },
      { title: 'Careers', href: '/careers' },
      { title: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Support',
    links: [
      { title: 'Customer service', href: '/support' },
      { title: 'FAQ', href: '/faq' },
      { title: 'Terms & conditions', href: '/terms' },
      { title: 'Insurance glossary', href: '/glossary' },
      { title: 'Privacy', href: '/privacy' },
      { title: 'Legal safety', href: '/legal' },
    ],
  },
]
