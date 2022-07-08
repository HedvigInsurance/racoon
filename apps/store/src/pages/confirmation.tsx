import type { NextPageWithLayout } from 'next'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'

const CheckoutConfirmationPage: NextPageWithLayout = () => {
  return <ConfirmationPage />
}

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage
