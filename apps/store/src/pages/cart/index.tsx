import type { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useMemo } from 'react'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { CartPage } from '@/components/CartPage/CartPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getRevalidate } from '@/services/storyblok/storyblok'

const NextCartPage: NextPageWithLayout = () => {
  const { shopSession } = useShopSession()
  const { t } = useTranslation('cart')

  const entries = useMemo(
    () => shopSession?.cart.entries.map(getCartEntry),
    [shopSession?.cart.entries],
  )

  return (
    <>
      <Head>
        <title>{`${t('CART_PAGE_HEADING')} | Hedvig`}</title>
      </Head>
      <CartPage entries={entries} />
    </>
  )
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await getLayoutWithMenuProps(context)
  if (props === null) return { notFound: true }

  return {
    props,
    revalidate: getRevalidate(),
  }
}

export default NextCartPage
