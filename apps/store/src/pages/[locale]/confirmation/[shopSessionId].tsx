import { type ApolloClient, isApolloError } from '@apollo/client'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { type ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { fetchConfirmationStory } from '@/components/ConfirmationPage/fetchConfirmationStory'
import { SuccessAnimation } from '@/components/ConfirmationPage/SuccessAnimation/SuccessAnimation'
import { fetchSwitchingData } from '@/components/ConfirmationPage/SwitchingAssistantSection/fetchSwitchingData'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import {
  CurrentMemberDocument,
  type CurrentMemberQuery,
  type CurrentMemberQueryVariables,
} from '@/services/graphql/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { type StoryblokPageProps } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Params = { shopSessionId: string }

type Props = ConfirmationPageProps & { shopSessionId: string } & Pick<
    StoryblokPageProps,
    'globalStory'
  >

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  const { req, res, locale, params } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  try {
    const apolloClient = await initializeApolloServerSide({ req, res, locale })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    const shopSession = await shopSessionService.fetchById(shopSessionId)

    const [layoutWithMenuProps, switchingData, memberPartnerData, story] = await Promise.all([
      getLayoutWithMenuProps(context, apolloClient),
      fetchSwitchingData(shopSessionService, shopSessionId),
      fetchMemberPartnerData(apolloClient),
      fetchConfirmationStory(locale),
    ])

    // @TODO: uncomment after implementing signing
    // if (shopSession.checkout.completedAt === null) {
    //   return { redirect: { destination: PageLink.store({ locale }), permanent: false } }
    // }

    return addApolloState(apolloClient, {
      props: {
        ...layoutWithMenuProps,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        cart: shopSession.cart,
        story,
        memberPartnerData,
        ...(switchingData ? { switching: switchingData } : {}),
      },
    })
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

const CheckoutConfirmationPage: NextPageWithLayout<Props> = (props) => {
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
