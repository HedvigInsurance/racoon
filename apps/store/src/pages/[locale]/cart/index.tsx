import type { GetStaticProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { CartPage } from '@/components/CartPage/CartPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getRevalidate } from '@/services/storyblok/storyblok'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { staticPathsPerSwedenLocale } from '@/utils/staticPaths'

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
  patchNextI18nContext(context)
  try {
    const props = await getLayoutWithMenuProps(context)

    return {
      props,
      revalidate: getRevalidate(),
    }
  } catch {
    return { notFound: true }
  }
}

export const getStaticPaths = staticPathsPerSwedenLocale

export default NextCartPage
