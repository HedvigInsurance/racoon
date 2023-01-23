import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { SwitchingAssistantPage } from '@/components/SwitchingAssistantPage/SwitchingAssistantPage'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextPageProps = {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextSwitchingAssistantPage: NextPage<NextPageProps> = () => {
  const { shopSession } = useShopSession()

  if (!shopSession) return null

  return <SwitchingAssistantPage shopSession={shopSession} />
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const apolloClient = initializeApollo({ req, res })
  const [shopSession, translations] = await Promise.all([
    getCurrentShopSessionServerSide({ apolloClient, req, res }),
    serverSideTranslations(locale),
  ])

  // TODO: check if user is authenticated

  const pageProps = {
    ...translations,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
  } satisfies NextPageProps

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextSwitchingAssistantPage
