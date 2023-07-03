import type { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useMemo } from 'react'
import {
  getCrossOut,
  useGetDiscountDurationExplanation,
  getTotal,
  getCartEntry,
} from '@/components/CartInventory/CartInventory.helpers'
import { CartPage } from '@/components/CartPage/CartPage'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { initializeApollo } from '@/services/apollo/client'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'

const NextCartPage: NextPageWithLayout = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()
  const { t } = useTranslation('cart')

  const entries = useMemo(
    () => shopSession?.cart.entries.map(getCartEntry),
    [shopSession?.cart.entries],
  )
  const campaigns = shopSession?.cart.redeemedCampaigns.map((item) => ({
    id: item.id,
    code: item.code,
    discountExplanation: getDiscountExplanation(item.discount),
    discountDurationExplanation: getDiscountDurationExplanation(
      shopSession.cart.redeemedCampaigns[0].discount,
      shopSession.cart.cost.gross,
    ),
  }))

  const cost = shopSession
    ? {
        total: getTotal(shopSession),
        crossOut: getCrossOut(shopSession),
      }
    : undefined

  return (
    <>
      <Head>
        <title>{`${t('CART_PAGE_HEADING')} | Hedvig`}</title>
      </Head>
      <CartPage
        shopSessionId={shopSession?.id}
        entries={entries}
        campaigns={campaigns}
        campaignsEnabled={shopSession?.cart.campaignsEnabled}
        cost={cost}
        {...props}
      />
    </>
  )
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }
  const apolloClient = initializeApollo({ locale })
  const [globalStory, translations, productMetadata] = await Promise.all([
    getGlobalStory({ locale }),
    serverSideTranslations(locale),
    fetchGlobalProductMetadata({ apolloClient }),
  ])

  const revalidate = process.env.VERCEL_ENV === 'preview' ? 1 : false
  return {
    props: {
      ...translations,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
    },
    revalidate,
  }
}

export default NextCartPage
