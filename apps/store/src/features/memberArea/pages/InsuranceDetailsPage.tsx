import type { NextPageWithLayout } from 'next'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { InsuranceDetailsSection } from '../InsuranceSection/InsuranceDetailsSection'

export const InsuranceDetailsPage: NextPageWithLayout = () => {
  return <InsuranceDetailsSection />
}

InsuranceDetailsPage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
