import type { GetServerSideProps, NextPage } from 'next'
import { StorePage } from '@/components/StorePage/StorePage'
import { StorePageProps } from '@/components/StorePage/StorePage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { getProductsByMarket } from '@/services/mockProductService'

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
