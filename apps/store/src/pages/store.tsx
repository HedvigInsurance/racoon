import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { StorePage } from '@/components/StorePage/StorePage'
import { StorePageProps } from '@/components/StorePage/StorePage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { CmsService } from '@/services/cms/CmsService'

const NextStorePage: NextPageWithLayout<StorePageProps> = (props: StorePageProps) => {
  return <StorePage {...props} />
}

export const getServerSideProps: GetServerSideProps<StorePageProps> = async (context) => {
  const localeData = getLocale(context.locale ?? context.defaultLocale)

  const products = await CmsService.getProductsByMarket(localeData.marketLabel)

  return {
    props: {
      products,
    },
  }
}

NextStorePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextStorePage
