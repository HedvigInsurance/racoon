import type { GetServerSideProps, NextPage } from 'next'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { getProductByMarketAndSlug } from '@/services/mockCmsService'

const NextProductPage: NextPage<ProductPageProps> = (props: ProductPageProps) => {
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

  return {
    props: {
      cmsProduct,
    },
  }
}

export default NextProductPage
