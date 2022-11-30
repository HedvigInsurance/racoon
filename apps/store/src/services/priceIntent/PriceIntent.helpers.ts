import { ApolloClient } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import {
  PriceIntentCreateDocument,
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateDocument,
  PriceIntentDataUpdateMutation,
  PriceIntentDataUpdateMutationVariables,
} from '@/services/apollo/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { COOKIE_KEY_PRICE_INTENT } from './priceIntent.constants'
import { PriceIntentService } from './PriceIntentService'

export const priceIntentServiceInitServerSide = ({
  apolloClient,
  req,
  res,
  shopSession,
}: Params) => {
  return new PriceIntentService(
    new ServerCookiePersister(COOKIE_KEY_PRICE_INTENT, req, res), // FIXME: it makes no sense to pass in this key anymore since it's always overridden
    apolloClient,
    shopSession,
  )
}

export const priceIntentServiceInitClientSide = ({
  apolloClient,
  shopSession,
}: Omit<Params, 'req' | 'res'>) => {
  return new PriceIntentService(
    new CookiePersister(COOKIE_KEY_PRICE_INTENT), // FIXME: it makes no sense to pass in this key anymore since it's always overridden
    apolloClient,
    shopSession,
  )
}

type Params = {
  apolloClient: ApolloClient<unknown>
  shopSession: ShopSession
} & Pick<GetServerSidePropsContext, 'locale' | 'req' | 'res'>

type UpdatePriceIntentDataParams = PriceIntentDataUpdateMutationVariables & {
  apolloClient: ApolloClient<unknown>
}

export const updatePriceIntentData = async (params: UpdatePriceIntentDataParams) => {
  const { apolloClient, data, locale, priceIntentId } = params

  const updatedResult = await apolloClient.mutate<
    PriceIntentDataUpdateMutation,
    PriceIntentDataUpdateMutationVariables
  >({
    mutation: PriceIntentDataUpdateDocument,
    variables: { data, locale, priceIntentId },
  })

  const updatedPriceIntent = updatedResult.data?.priceIntentDataUpdate.priceIntent
  if (!updatedPriceIntent) {
    throw new Error('Could not update price intent with initial data')
  }

  return updatedPriceIntent
}

type CreatePriceIntentParams = PriceIntentCreateMutationVariables & {
  apolloClient: ApolloClient<unknown>
}

export const createPriceIntent = async (params: CreatePriceIntentParams) => {
  const { apolloClient, locale, shopSessionId, productName } = params

  const result = await apolloClient.mutate<
    PriceIntentCreateMutation,
    PriceIntentCreateMutationVariables
  >({
    mutation: PriceIntentCreateDocument,
    variables: { locale, productName, shopSessionId },
  })

  const priceIntent = result.data?.priceIntentCreate
  if (!priceIntent) throw new Error('Could not create price intent')

  return priceIntent
}
