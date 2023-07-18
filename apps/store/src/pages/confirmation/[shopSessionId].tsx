import { ApolloClient, isApolloError } from '@apollo/client'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { SuccessAnimation } from '@/components/ConfirmationPage/SuccessAnimation/SuccessAnimation'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import {
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
  ShopSessionOutcomeQuery,
} from '@/services/apollo/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ConfirmationStory, getStoryBySlug } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

const CONFIRMATION_PAGE_SLUG = 'confirmation'

type Params = { shopSessionId: string }

export const getServerSideProps: GetServerSideProps<ConfirmationPageProps, Params> = async (
  context,
) => {
  const { req, res, locale, params } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

  const [layoutWithMenuProps, shopSession, outcome, memberPartnerData, story] = await Promise.all([
    getLayoutWithMenuProps(context, apolloClient),
    shopSessionService.fetchById(shopSessionId),
    shopSessionService.fetchOutcome(shopSessionId),
    fetchMemberPartnerData(apolloClient),
    getStoryBySlug(CONFIRMATION_PAGE_SLUG, { locale }),
  ])

  if (layoutWithMenuProps === null) return { notFound: true }

  // @TODO: uncomment after implementing signing
  // if (shopSession.checkout.completedAt === null) {
  //   return { redirect: { destination: PageLink.store({ locale }), permanent: false } }
  // }

  return addApolloState(apolloClient, {
    props: {
      ...layoutWithMenuProps,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      cart: shopSession.cart,
      currency: shopSession.currencyCode,
      story,
      memberPartnerData,
      ...getSwitching(outcome),
    },
  })
}

const CheckoutConfirmationPage: NextPageWithLayout<
  ConfirmationPageProps & { story: ConfirmationStory }
> = (props) => {
  return (
    <>
      <Head>
        <title>{props.story.content.seoTitle}</title>
      </Head>
      <SuccessAnimation>
        <ConfirmationPage {...props} />
      </SuccessAnimation>
    </>
  )
}

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage

const fetchMemberPartnerData = async (apolloClient: ApolloClient<unknown>) => {
  if (!Features.enabled('SAS_PARTNERSHIP')) {
    return null
  }
  try {
    const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
      query: CurrentMemberDocument,
    })
    return data.currentMember.partnerData ?? null
  } catch (err) {
    if (err instanceof Error && isApolloError(err)) {
      console.info('Failed to fetch currentMember', err)
      return null
    } else {
      throw err
    }
  }
}

const getSwitching = (
  outcome: ShopSessionOutcomeQuery['shopSession']['outcome'],
): Pick<ConfirmationPageProps, 'switching'> | undefined => {
  const switchingContract = outcome?.createdContracts.find(
    (item) => !!item.externalInsuranceCancellation?.bankSignering,
  )

  if (!switchingContract) return undefined

  const externalInsurer = switchingContract.externalInsuranceCancellation?.externalInsurer

  if (!externalInsurer) return undefined

  return { switching: { companyDisplayName: externalInsurer.displayName } }
}
