import { countries } from '@/lib/l10n/countries'
import { FALLBACK_LOCALE, LocaleData, locales } from '@/lib/l10n/locales'
import { CountryLabel, IsoLocale, Locale, RoutingLocale, UiLocale } from '@/lib/l10n/types'
import routingLocales from '../../routingLocales'

const routingToIsoLocales = {} as { [key in RoutingLocale]: IsoLocale }
const isoToRoutingLocales = {} as { [key in IsoLocale]: RoutingLocale }

routingLocales.forEach((routingLocale) => {
  let isoLocale: IsoLocale
  if (routingLocale.length === 2) {
    const countryData = countries[routingLocale.toUpperCase() as CountryLabel]
    if (countryData) {
      isoLocale = countryData.defaultLocale
    } else {
      throw new Error(
        `Incorrect configuration, failed to find country by routing locale <${routingLocale}>`,
      )
    }
  } else {
    const localeParts = routingLocale.split('-', 2)
    isoLocale = `${localeParts[0].toLowerCase()}-${localeParts[1].toUpperCase()}` as IsoLocale
  }
  routingToIsoLocales[routingLocale] = isoLocale
  isoToRoutingLocales[isoLocale] = routingLocale
})

export const toIsoLocale = (locale: UiLocale): IsoLocale => {
  if (isRoutingLocale(locale)) return routingToIsoLocales[locale]
  return locale
}

export const toRoutingLocale = (locale: UiLocale): RoutingLocale => {
  if (isIsoLocale(locale)) return isoToRoutingLocales[locale]
  return locale
}

export const isIsoLocale = (locale: string): locale is IsoLocale => {
  return locale in isoToRoutingLocales
}

export const isRoutingLocale = (locale: string): locale is RoutingLocale => {
  return locale in routingToIsoLocales
}

export const isSupportedLocale = (locale: unknown): locale is UiLocale => {
  return (
    typeof locale === 'string' &&
    Object.values(Locale).some((x) => x === locale || toRoutingLocale(x) === locale)
  )
}

// TODO: Make fallback market-specific
export const getLocaleOrFallback = (locale: UiLocale | string | undefined): LocaleData => {
  if (!isSupportedLocale(locale)) {
    return locales[FALLBACK_LOCALE]
  }
  return locales[toIsoLocale(locale)]
}
