import type { GetServerSideProps, NextPage } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

type Props = Record<string, unknown>
type Params = { shopSessionId: string }

const NextSessionPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res, query } = context

  const fallbackRedirect = { redirect: { destination: PageLink.home(), permanent: false } }
  if (!isRoutingLocale(locale)) return fallbackRedirect

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return fallbackRedirect
  }

  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    const shopSession = await shopSessionService.fetchById(shopSessionId)
    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return fallbackRedirect
  }

  const nextURL = new URL(ORIGIN_URL)
  nextURL.pathname = PageLink.home({ locale })

  const nextQueryParam = query['next']
  if (typeof nextQueryParam === 'string') {
    nextURL.pathname = nextQueryParam
  }

  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  return { redirect: { destination, permanent: false } }
}

export default NextSessionPage
