import { NextPageWithLayout } from 'next'
import { Heading } from 'ui'
import { Insurances } from '@/features/memberArea/components/Insurances'
import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/apollo/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'
import { PaymentsSection } from '../PaymentsSection'

export const InsurancePage: NextPageWithLayout = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      {loading && 'Loading...'}
      {data && <MemberInfo data={data} />}
    </>
  )
}

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}
const MemberInfo = ({ data }: MemberInfoProps) => {
  const { currentMember } = data
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`
  return (
    <>
      <Heading as={'h2'} variant="standard.32">
        {greeting}
      </Heading>
      <Insurances data={data} />
      <br />
      <br />
      <PaymentsSection />
    </>
  )
}

InsurancePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
