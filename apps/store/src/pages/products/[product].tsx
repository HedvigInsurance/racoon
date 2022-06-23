import type { GetServerSideProps, NextPage } from 'next'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { getProductByMarketAndSlug } from '@/services/mockCmsService'
import { getProductByMarketAndName } from '@/services/mockProductService'
import { NextPageWithLayout } from '../_app'

const NextProductPage: NextPageWithLayout<ProductPageProps> = (props: ProductPageProps) => {
  return <ProductPage {...props} />
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const localeData = getLocale(context.locale ?? context.defaultLocale)
  const slugParam = context.params?.product

  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  if (!slug) {
    return {
      notFound: true,
    }
  }

  const cmsProduct = getProductByMarketAndSlug(localeData.marketLabel, slug)

  if (!cmsProduct) {
    return {
      notFound: true,
    }
  }

  const product = getProductByMarketAndName(cmsProduct.market, cmsProduct.product)

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      cmsProduct,
      product,
    },
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
