import type { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { CartPage } from '@/components/CartPage/CartPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getRevalidate } from '@/services/storyblok/storyblok'

const NextCartPage: NextPageWithLayout = () => {
  const { t } = useTranslation('cart')

  return (
    <>
      <Head>
        <title>{`${t('CART_PAGE_HEADING')} | Hedvig`}</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <CartPage />
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
