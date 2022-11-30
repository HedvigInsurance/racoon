import { ApolloClient } from '@apollo/client'
import type { GetServerSidePropsContext } from 'next'
import type { CountryCode } from '@/services/apollo/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { getLocaleOrFallback, toIsoLocale } from '@/utils/l10n/localeUtils'
import { COOKIE_KEY_SHOP_SESSION } from './ShopSession.constants'
import { ShopSessionService } from './ShopSessionService'

type Params = {
  apolloClient: ApolloClient<unknown>
  locale: GetServerSidePropsContext['locale']
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}

export const getCurrentShopSessionServerSide = async (params: Params) => {
  const shopSessionService = setupShopSessionServiceServerSide(params)
  const { locale } = getLocaleOrFallback(params.locale)
  const shopSession = await shopSessionService.fetch(toIsoLocale(locale))

  if (shopSession === null) throw new Error('Current ShopSession not found')

  return shopSession
}

export const getShopSessionServerSide = async (params: GetShopSessionParams) => {
  const shopSessionService = setupShopSessionServiceServerSide(params)
  const { locale } = getLocaleOrFallback(params.locale)
  const { countryCode } = params
  return await shopSessionService.getOrCreate({ countryCode, locale })
}

type GetShopSessionParams = Params & { countryCode: CountryCode }

export const setupShopSessionServiceClientSide = (apolloClient: ApolloClient<unknown>) => {
  return new ShopSessionService(new CookiePersister(COOKIE_KEY_SHOP_SESSION), apolloClient)
}

export const setupShopSessionServiceServerSide = (params: Omit<Params, 'locale'>) => {
  const { req, res, apolloClient } = params
  return new ShopSessionService(
    new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, req, res),
    apolloClient,
  )
}
