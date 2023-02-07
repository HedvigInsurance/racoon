import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ConfirmationStory, getGlobalStory, getStoryBySlug } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { getMobilePlatform } from '@/utils/getMobilePlatform'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Params = { shopSessionId: string }

export const getServerSideProps: GetServerSideProps<ConfirmationPageProps, Params> = async (
  context,
) => {
  const { req, res, locale, params, resolvedUrl } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = getConfirmationPageSlugByUrl(resolvedUrl)

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  const apolloClient = initializeApollo({ req, res })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  const [shopSession, translations, globalStory, story, productMetadata] = await Promise.all([
    shopSessionService.fetchById(shopSessionId),
    serverSideTranslations(locale),
    getGlobalStory({ locale }),
    getStoryBySlug(slug, { locale }),
    fetchGlobalProductMetadata({ apolloClient }),
  ])

  // @TODO: uncomment after implementing signing
  // if (shopSession.checkout.completedAt === null) {
  //   return { redirect: { destination: PageLink.store({ locale }), permanent: false } }
  // }

  if (story === undefined) {
    console.warn(`Page not found: ${slug}, locale: ${locale}`)
    return { notFound: true }
  }

  return addApolloState(apolloClient, {
    props: {
      ...translations,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
      cart: shopSession.cart,
      currency: shopSession.currencyCode,
      platform: getMobilePlatform(req.headers['user-agent'] ?? ''),
      story,
    },
  })
}

const CheckoutConfirmationPage: NextPageWithLayout<
  ConfirmationPageProps & { story: ConfirmationStory }
> = (props) => <ConfirmationPage {...props} />

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage

const getConfirmationPageSlugByUrl = (url: string) => {
  const urlParts = url.split('/')
  const slug = urlParts[1]
  return slug
}
