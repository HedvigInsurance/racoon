import { NextPageWithLayout } from 'next'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { PaymentsSection } from '../PaymentsSection/PaymentsSection'

export const PaymentsPage: NextPageWithLayout = () => {
  return <PaymentsSection />
}

PaymentsPage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
