import type { NextPageWithLayout } from 'next'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { Insurances } from '../InsuranceSection/InsurancesSection'

export const InsurancePage: NextPageWithLayout = () => {
  return <Insurances />
}

InsurancePage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
