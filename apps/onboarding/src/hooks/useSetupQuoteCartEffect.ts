import { datadogRum } from '@datadog/browser-rum'
import { getCookie, setCookie } from 'cookies-next'
import { useEffect } from 'react'
import { useCurrentLocale } from '@/lib/l10n'
import { QuoteCart } from '@/services/quote-cart'

export const useSetupQuoteCartEffect = () => {
  const { apiMarket, isoLocale } = useCurrentLocale()

  useEffect(() => {
    const checkQuoteCartSession = async () => {
      let quoteCartId = getCookie(QuoteCart.COOKIE_KEY)

      if (typeof quoteCartId === 'string') {
        try {
          const isValid = await QuoteCart.validate({ id: quoteCartId, market: apiMarket })
          quoteCartId = isValid ? quoteCartId : undefined
        } catch (error) {
          quoteCartId = undefined
          datadogRum.addError(error, { quoteCartId, apiMarket })
        }
      }

      if (quoteCartId === undefined) {
        try {
          const newQuoteCartId = await QuoteCart.create({ market: apiMarket, locale: isoLocale })
          setCookie(QuoteCart.COOKIE_KEY, newQuoteCartId)
        } catch (error) {
          datadogRum.addError(error, { apiMarket, isoLocale })
        }
      }
    }

    checkQuoteCartSession()
  }, [apiMarket, isoLocale])
}
