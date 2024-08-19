import styled from '@emotion/styled'
import Link from 'next/link'
import { Space } from 'ui'
import { CONTENT_WIDTH } from '@/features/memberArea/components/MemberAreaLayout.css'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'

export const Insurances = () => {
  const currentMember = useMemberAreaInfo()

  return (
    <Wrapper>
      <Space y={1}>
        {currentMember.activeContracts.map((contract) => (
          <InuranceLink key={contract.id} href={`/member/insurances/${contract.id}`}>
            <InsuranceCard contract={contract} />
          </InuranceLink>
        ))}
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: CONTENT_WIDTH,
})

export const InuranceLink = styled(Link)({
  display: 'block',
  cursor: 'pointer',
})
