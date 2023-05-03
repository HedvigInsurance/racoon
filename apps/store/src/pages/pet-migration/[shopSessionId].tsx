import type { NextPageWithLayout } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { Flags } from '@/services/Flags/Flags'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = Record<string, unknown>
type Params = { shopSessionId: string }

const NextPetMigratePage: NextPageWithLayout = () => {
  const { shopSession } = useShopSession()

  return (
    <>
      <Head>
        <title>TODO: Page title</title>
        <meta name="robots" content="none" />
      </Head>
      <>
        <hr />
        <h1>TODO: Migration page</h1>
        <div>Session data:</div>
        <pre>${JSON.stringify(shopSession, null, 2)}</pre>
      </>
    </>
  )
}

NextPetMigratePage.getLayout = (children) => (
  <div>
    <h2>TODO: Implement layout</h2>
    {children}
  </div>
)

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context

  if (!Flags.getFeature('PET_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return { notFound: true }
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession
  try {
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    shopSession = await shopSessionService.fetchById(shopSessionId)
    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return { notFound: true }
  }

  return addApolloState(apolloClient, {
    props: {
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
    },
  })
}

export default NextPetMigratePage
