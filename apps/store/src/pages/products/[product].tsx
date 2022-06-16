import type { GetServerSideProps, NextPage } from 'next'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getProductByMarketAndSlug } from '@/services/mockProductService'

const NextProductPage: NextPage<ProductPageProps> = (props: ProductPageProps) => {
  return <ProductPage {...props} />
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const market = 'se'
  const slugParam = context?.params?.product

  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  if (!slug) {
    return {
      notFound: true,
    }
  }

  const product = getProductByMarketAndSlug(market, slug)

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product,
    },
  }
}

export default NextProductPage
