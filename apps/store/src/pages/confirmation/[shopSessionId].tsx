import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { getMobilePlatform } from '@/components/ConfirmationPage/ConfirmationPage.helpers'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
// import { PageLink } from '@/lib/PageLink'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'

type Params = { shopSessionId: string }

export const getServerSideProps: GetServerSideProps<ConfirmationPageProps, Params> = async (
  context,
) => {
  const { req, res, locale, params } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  const apolloClient = initializeApollo({ req, res })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  try {
    const [shopSession, globalStory, translations] = await Promise.all([
      shopSessionService.fetchById(shopSessionId, toIsoLocale(locale)),
      getGlobalStory({ locale }),
      serverSideTranslations(locale),
    ])

    // @TODO: uncomment after implementing signing
    // if (shopSession.checkout.completedAt === null) {
    //   return { redirect: { destination: PageLink.store({ locale }), permanent: false } }
    // }

    return addApolloState(apolloClient, {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSessionId,
        [GLOBAL_STORY_PROP_NAME]: globalStory,
        cart: shopSession.cart,
        currency: shopSession.currencyCode,
        platform: getMobilePlatform(req.headers['user-agent'] ?? ''),
      },
    })
  } catch (error) {
    logger.error(error, 'Unable to render confirmation page')
    return { notFound: true }
  }
}

const CheckoutConfirmationPage: NextPageWithLayout<ConfirmationPageProps> = (props) => {
  return <ConfirmationPage {...props} />
}

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage
