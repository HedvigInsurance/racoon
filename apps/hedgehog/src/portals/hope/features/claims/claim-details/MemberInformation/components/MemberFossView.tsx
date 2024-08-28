import * as React from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Copyable, Flex } from '@hedvig-ui'

export const MemberFossView: React.FC = () => {
  const { member, claimNumber } = useClaim()
  return (
    <Flex direction="column" gap="small">
      <Flex justify="space-between">
        <span>Claim number:</span>
        <Copyable iconValue={claimNumber} />
      </Flex>
      <Flex justify="space-between">
        <span>Member ID:</span>
        <Copyable iconValue={member.memberId} />
      </Flex>
      <Flex justify="space-between">
        <span>Name:</span>
        <Copyable iconValue={`${member.firstName} ${member.lastName}`} />
      </Flex>
      <Flex justify="space-between">
        <span>Personal number:</span>
        <Copyable iconValue={member.personalNumber} />
      </Flex>
      <Flex justify="space-between">
        <span>Email:</span>
        <Copyable iconValue={member.email} />
      </Flex>
    </Flex>
  )
}
