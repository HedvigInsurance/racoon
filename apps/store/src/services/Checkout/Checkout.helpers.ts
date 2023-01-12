import { ApolloClient } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import {
  CheckoutSigningDocument,
  CheckoutSigningQuery,
  CheckoutSigningQueryVariables,
} from '@/services/apollo/generated'

type FetchParams = CheckoutSigningQueryVariables & {
  apolloClient: ApolloClient<unknown>
}

const fetchCheckoutSigning = async ({ apolloClient, ...variables }: FetchParams) => {
  const result = await apolloClient.query<CheckoutSigningQuery, CheckoutSigningQueryVariables>({
    query: CheckoutSigningDocument,
    variables,
  })

  return result.data.checkoutSigning
}

type FetchCurrentParams = Omit<FetchParams, 'checkoutSigningId'> & {
  req: GetServerSidePropsContext['req']
  checkoutId: string
}

export const fetchCurrentCheckoutSigning = async ({
  req,
  checkoutId,
  ...params
}: FetchCurrentParams) => {
  const checkoutSigningId = req.cookies[checkoutId]

  try {
    if (checkoutSigningId) {
      return await fetchCheckoutSigning({ ...params, checkoutSigningId })
    }
  } catch (error) {
    console.warn(`Unable to fetch checkout signing ${JSON.stringify({ checkoutSigningId, error })}`)
  }

  return null
}
