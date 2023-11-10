import { ApolloClient } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { ComponentPropsWithoutRef } from 'react'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { initializeApolloServerSide, addApolloState } from '@/services/apollo/client'
import {
  CarTrialExtensionDocument,
  CarTrialExtensionQuery,
  CarTrialExtensionQueryVariables,
} from '@/services/apollo/generated'
import { ConfirmationStory, getStoryBySlug } from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = ComponentPropsWithoutRef<typeof ConfirmationPage>

type Params = { contractId: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { req, res, locale, params, resolvedUrl } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const contractId = params?.contractId
  if (!contractId) return { notFound: true }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  // with-extension | without-extension
  const confirmationStorySlug = resolvedUrl.split('/')[2]

  const [trialExtension, layoutWithMenuProps, story] = await Promise.all([
    fetchTrialExtensionData(apolloClient, contractId),
    getLayoutWithMenuProps(context, apolloClient),
    getStoryBySlug<ConfirmationStory>(confirmationStorySlug, { locale }),
  ])

  if (trialExtension == null) return { notFound: true }

  if (layoutWithMenuProps === null) return { notFound: true }

  return addApolloState(apolloClient, {
    props: {
      ...layoutWithMenuProps,
      shopSessionId: trialExtension.shopSession.id,
      cart: trialExtension.shopSession.cart,
      carTrialContract: trialExtension.trialContract,
      story,
      memberPartnerData: null,
    },
  })
}

const fetchTrialExtensionData = async (
  apolloClient: ApolloClient<unknown>,
  contractId: string,
): Promise<CarTrialExtensionQuery['carTrial'] | null> => {
  try {
    const { data } = await apolloClient.query<
      CarTrialExtensionQuery,
      CarTrialExtensionQueryVariables
    >({
      query: CarTrialExtensionDocument,
      variables: {
        contractId,
      },
    })

    const ssn = data.carTrial?.shopSession.customer?.ssn
    if (!ssn) {
      throw new Error(`No SSN in Shop Session ${contractId}`)
    }

    return data.carTrial
  } catch (err) {
    return null
  }
}

export { default } from '@/pages/confirmation/[shopSessionId]'
