import { useState } from 'react'
import styled from '@emotion/styled'
import { Shadowed, useConfirmDialog } from '@hedvig-ui'
import { Button, Flex, colors } from '@hedvig-ui/redesign'
import { ResourceAccessOverview } from '@hope/features/resource-access/overview/ResourceAccessOverview'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { useRestrictClaim } from '@hope/common/hooks/use-restrict-claim'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ResourceAccessInformation } from 'types/generated/graphql'

const Subtext = styled.span`
  font-size: 12px;
  color: ${colors.textSecondary};
`

export const ClaimRestrictionInformationNew = () => {
  const { claimId, restriction } = useClaim()
  const { release } = useRestrictClaim(claimId)
  const [showModal, setShowModal] = useState(false)
  const { confirm } = useConfirmDialog()

  if (!restriction) {
    return null
  }

  return (
    <>
      <ResourceAccessOverview
        resourceAccess={restriction as ResourceAccessInformation}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
      <Flex align="center" gap="small">
        <Flex align="center" gap="large">
          <ShieldLockFill size="24" />

          <Flex direction="column" gap="tiny">
            <span>
              This claim has been marked as restricted by{' '}
              <Shadowed>{restriction.restrictedBy.fullName}</Shadowed>
            </span>

            <Subtext>
              Only users or roles that have been granted access will be able to
              see this claim
            </Subtext>
          </Flex>
        </Flex>

        <Flex style={{ width: 'auto' }}>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            {restriction.restrictedByMe ? 'Manage access' : 'Access overview'}
          </Button>

          {restriction.restrictedByMe && (
            <Button
              variant="secondary"
              onClick={() => {
                confirm(
                  'Are you sure you want to remove the restriction? Everybody will be able to see this claim',
                ).then(() => release())
              }}
              style={{ marginLeft: '1em' }}
            >
              Remove restriction
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  )
}
