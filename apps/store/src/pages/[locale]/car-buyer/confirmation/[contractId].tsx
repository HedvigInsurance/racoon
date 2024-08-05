import type { ApolloClient } from '@apollo/client'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { type ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { STORYBLOK_CAR_DEALERSHIP_FOLDER_SLUG } from '@/features/carDealership/carDearlership.constants'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import type {
  CarTrialExtensionQuery,
  CarTrialExtensionQueryVariables,
} from '@/services/graphql/generated'
import { CarTrialExtensionDocument } from '@/services/graphql/generated'
import { type ConfirmationStory, type StoryblokPageProps } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

// globalStory is used by page's layout
type Props = ConfirmationPageProps & { shopSessionId: string } & Pick<
    StoryblokPageProps,
    'globalStory'
  >

type Params = { contractId: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  const { req, res, locale, params } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const contractId = params?.contractId
  if (!contractId) return { notFound: true }

  try {
    const apolloClient = await initializeApolloServerSide({ req, res, locale })
    const slug = `${STORYBLOK_CAR_DEALERSHIP_FOLDER_SLUG}/confirmation`

    const [trialExtension, layoutWithMenuProps, story] = await Promise.all([
      fetchTrialExtensionData(apolloClient, contractId),
      getLayoutWithMenuProps(context, apolloClient),
      getStoryBySlug<ConfirmationStory>(slug, { locale }),
    ])

    if (trialExtension == null) return { notFound: true }

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
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
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

const CarBuyerConfirmationPage: NextPageWithLayout<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{props.story.content.seoTitle}</title>
      </Head>
      <ConfirmationPage {...props} />
    </>
  )
}

CarBuyerConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CarBuyerConfirmationPage
