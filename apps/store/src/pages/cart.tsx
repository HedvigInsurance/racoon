import type { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useMemo } from 'react'
import {
  getCrossOut,
  useGetDiscountDurationExplanation,
  getTotal,
  getCartEntry,
} from '@/components/CartInventory/CartInventory.helpers'
import { CartPage } from '@/components/CartPage/CartPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
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
  const props = await getLayoutWithMenuProps(context)
  if (props === null) return { notFound: true }

  return {
    props,
    revalidate: process.env.VERCEL_ENV === 'preview' ? 1 : false,
  }
}

export default NextCartPage
