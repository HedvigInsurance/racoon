import type { GetServerSideProps, NextPage } from 'next'
import { StorePage } from '@/components/StorePage/StorePage'
import { getProductsByMarket, Product } from '@/services/mockProductService'

export type StorePageProps = {
  products: Product[]
}

const NextStorePage: NextPage<StorePageProps> = (props: StorePageProps) => {
  return <StorePage {...props} />
}

export const getServerSideProps: GetServerSideProps<StorePageProps> = async () => {
  const market = 'se'
  const products = getProductsByMarket(market)

  return {
    props: {
      products,
    },
  }
}

export default NextStorePage
