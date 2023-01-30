import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory, getStoryBySlug } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { getMobilePlatform } from '@/utils/getMobilePlatform'
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

  const apolloClient = initializeApollo({ req, res })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  const [shopSession, translations, globalStory, story] = await Promise.all([
    shopSessionService.fetchById(shopSessionId),
    serverSideTranslations(locale),
    getGlobalStory({ locale }),
    getStoryBySlug(CONFIRMATION_PAGE_SLUG, { locale }),
  ])

  // @TODO: uncomment after implementing signing
  // if (shopSession.checkout.completedAt === null) {
  //   return { redirect: { destination: PageLink.store({ locale }), permanent: false } }
  // }

  return addApolloState(apolloClient, {
    props: {
      ...translations,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      cart: shopSession.cart,
      currency: shopSession.currencyCode,
      platform: getMobilePlatform(req.headers['user-agent'] ?? ''),
      story,
    },
  })
}

const CheckoutConfirmationPage: NextPageWithLayout<ConfirmationPageProps> = (props) => (
  <ConfirmationPage {...props} />
)

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage
