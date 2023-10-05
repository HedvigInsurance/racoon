import { NextPageWithLayout } from 'next'
import { LayoutWithMenu } from '../components/LayoutWithMenu'
import { PaymentsSection } from '../PaymentsSection'

export const PaymentsPage: NextPageWithLayout = () => {
  return <PaymentsSection />
}

PaymentsPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
