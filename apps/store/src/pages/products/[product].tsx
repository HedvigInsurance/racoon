import type { GetServerSideProps, NextPage } from 'next'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductByMarketAndSlug, Product } from '@/services/mockProductService'
import { StorePageProps } from '../store'

export type NextProductPageProps = {
  product: Product
}

const NextProductPage: NextPage<NextProductPageProps> = (props: NextProductPageProps) => {
  return <ProductPage {...props} />
}

export const getServerSideProps: GetServerSideProps<NextProductPageProps> = async (context) => {
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
