import { CartPage } from '@/components/CartPage/CartPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { NextPageWithLayout } from './_app'

const NextCartPage: NextPageWithLayout = () => {
  return <CartPage />
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
