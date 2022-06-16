import type { GetServerSideProps, NextPage } from 'next'
import { StorePage } from '@/components/StorePage/StorePage'
import { getLocale } from '@/lib/l10n/getLocale'
import { getProductsByMarket, Product } from '@/services/mockProductService'

export type StorePageProps = {
  products: Product[]
}

const NextStorePage: NextPage<StorePageProps> = (props: StorePageProps) => {
  return <StorePage {...props} />
}

export const getServerSideProps: GetServerSideProps<StorePageProps> = async (context) => {
  const localeData = getLocale(context.locale ?? context.defaultLocale)

  const products = getProductsByMarket(localeData.marketLabel)

  return {
    props: {
      products,
    },
  }
}

export default NextStorePage
