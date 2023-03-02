import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import {
  getCrossOut,
  useGetDiscountDurationExplanation,
  useGetDiscountExplanation,
  getTotal,
} from '@/components/CartInventory/CartInventory.helpers'
import { CartPage } from '@/components/CartPage/CartPage'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import {
  getGlobalStory,
  StoryblokPreviewData,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { convertToDate } from '@/utils/date'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = { [SHOP_SESSION_PROP_NAME]: string }

const NextCartPage: NextPageWithLayout<Props> = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()
  const { t } = useTranslation('cart')

  if (!shopSession) return null

  const entries = shopSession.cart.entries.map((item) => ({
    offerId: item.id,
    title: item.variant.product.displayNameFull,
    cost: item.price,
    startDate: !item.cancellation.requested ? convertToDate(item.startDate) : undefined,
    pillow: {
      src: item.variant.product.pillowImage.src,
      alt: item.variant.product.pillowImage.alt ?? undefined,
    },
    documents: item.variant.documents,
    productName: item.variant.product.name,
    data: item.priceIntentData,
  }))

  const campaigns = shopSession.cart.redeemedCampaigns.map((item) => ({
    id: item.id,
    code: item.code,
    discountExplanation: getDiscountExplanation(item.discount),
    discountDurationExplanation: getDiscountDurationExplanation(
      shopSession.cart.redeemedCampaigns[0].discount,
      shopSession.cart.cost.gross,
    ),
  }))

  const cost = {
    total: getTotal(shopSession),
    crossOut: getCrossOut(shopSession),
  }

  return (
    <>
      <Head>
        <title>{`${t('CART_PAGE_HEADING')} | Hedvig`}</title>
      </Head>
      <CartPage
        cartId={shopSession.cart.id}
        entries={entries}
        campaigns={campaigns}
        campaignsEnabled={shopSession.cart.campaignsEnabled}
        cost={cost}
        {...props}
      />
    </>
  )
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export const getServerSideProps: GetServerSideProps<
  Props,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { req, res, locale, previewData: { version } = {} } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const [shopSession, translations, globalStory, productMetadata] = await Promise.all([
    getShopSessionServerSide({ apolloClient, countryCode, req, res }),
    serverSideTranslations(locale),
    getGlobalStory({ version, locale }),
    fetchGlobalProductMetadata({ apolloClient }),
  ])

  return addApolloState(apolloClient, {
    props: {
      ...translations,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
    },
  })
}

export default NextCartPage
