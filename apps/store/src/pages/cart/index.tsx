import type { NextPageWithLayout } from 'next'
import { CartPage } from '@/components/CartPage/CartPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'

const NextCartPage: NextPageWithLayout = () => {
  return <CartPage />
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
