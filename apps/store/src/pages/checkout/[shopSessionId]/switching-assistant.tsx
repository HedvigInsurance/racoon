import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import {
  SwitchingAssistantPage,
  SwitchingAssistantPageProps,
} from '@/components/SwitchingAssistantPage/SwitchingAssistantPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Params = { shopSessionId: string }

type NextPageProps = SwitchingAssistantPageProps & {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextSwitchingAssistantPage: NextPage<NextPageProps> = (props) => {
  return <SwitchingAssistantPage {...props} />
}

export const getServerSideProps: GetServerSideProps<NextPageProps, Params> = async (context) => {
  const { req, res, locale, params } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  const fallbackRedirect = {
    redirect: { destination: PageLink.confirmation({ locale, shopSessionId }), permanent: false },
  } as const

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession
  try {
    shopSession = await setupShopSessionServiceServerSide({ apolloClient, req, res }).fetchById(
      shopSessionId,
    )
    // TODO: validate ShopSession
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return fallbackRedirect
  }

  const [checkoutSteps, translations] = await Promise.all([
    fetchCheckoutSteps({ apolloClient, shopSession }),
    serverSideTranslations(locale),
  ])

  const pageProps = {
    ...translations,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
    checkoutSteps,
  } satisfies NextPageProps

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextSwitchingAssistantPage
