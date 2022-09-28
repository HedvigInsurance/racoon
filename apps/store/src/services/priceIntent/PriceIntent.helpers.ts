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
  req,
  res,
  shopSession,
  apolloClient,
}: Params) => {
  return new PriceIntentService(
    new ServerCookiePersister(COOKIE_KEY_PRICE_INTENT, req, res),
    apolloClient,
    shopSession,
  )
}

export const priceIntentServiceInitClientSide = ({
  shopSession,
  apolloClient,
}: Omit<Params, 'req' | 'res'>) => {
  return new PriceIntentService(
    new CookiePersister(COOKIE_KEY_PRICE_INTENT),
    apolloClient,
    shopSession,
  )
}

type Params = {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
  shopSession: ShopSession
  apolloClient: ApolloClient<unknown>
}

type UpdatePriceIntentDataParams = PriceIntentDataUpdateMutationVariables & {
  apolloClient: ApolloClient<unknown>
}

export const updatePriceIntentData = async (params: UpdatePriceIntentDataParams) => {
  const { apolloClient, priceIntentId, data } = params

  const updatedResult = await apolloClient.mutate<
    PriceIntentDataUpdateMutation,
    PriceIntentDataUpdateMutationVariables
  >({
    mutation: PriceIntentDataUpdateDocument,
    variables: { priceIntentId, data },
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
  const { apolloClient, shopSessionId, productName } = params

  const result = await apolloClient.mutate<
    PriceIntentCreateMutation,
    PriceIntentCreateMutationVariables
  >({
    mutation: PriceIntentCreateDocument,
    variables: { shopSessionId, productName },
  })

  const priceIntent = result.data?.priceIntentCreate
  if (!priceIntent) throw new Error('Could not create price intent')

  return priceIntent
}
