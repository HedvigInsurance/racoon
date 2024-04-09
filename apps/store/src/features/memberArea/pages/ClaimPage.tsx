import type { NextPageWithLayout } from 'next'
import { ClaimSection } from '../ClaimSection'
import { MemberAreaLayout } from '../components/MemberAreaLayout'

export const ClaimPage: NextPageWithLayout = () => {
  return <ClaimSection />
}

ClaimPage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
