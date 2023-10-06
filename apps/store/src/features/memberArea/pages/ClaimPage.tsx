import { NextPageWithLayout } from 'next'
import { ClaimSection } from '../ClaimSection'
import { LayoutWithMenu } from '../components/LayoutWithMenu'

export const ClaimPage: NextPageWithLayout = () => {
  return <ClaimSection />
}

ClaimPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
