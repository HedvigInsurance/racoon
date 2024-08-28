import styled from '@emotion/styled'
import { Label, Spacing } from '@hedvig-ui'
import { AccessListItem } from '@hope/features/resource-access/overview/components/Wrapper'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
} from 'types/generated/graphql'

const ModalLabel = styled(Label)`
  font-size: 0.8rem;
`

const roleMap: Record<string, string> = {
  IEX: 'IEX',
  IEX_EXTENDED: 'IEX Extended',
  DEV: 'Developer',
}

const UserRoleDisplayName = (role: string) => {
  if (!Object.keys(roleMap).includes(role)) {
    return role
  }

  return roleMap[role]
}

export const RoleAccessList: React.FC<{
  resourceAccessInformation: ResourceAccessInformation
}> = ({ resourceAccessInformation }) => {
  const [grantClaimAccess] = useGrantResourceAccessMutation()

  const { resourceId, restrictedByMe } = resourceAccessInformation

  const handleGrantAccess = (role: string) => {
    toast.promise(
      grantClaimAccess({
        variables: {
          resourceId,
          grantHolder: role,
          grantHolderType: GrantHolderType.Role,
        },
        optimisticResponse: {
          grantResourceAccess: {
            ...resourceAccessInformation,
            rolesGranted: [...resourceAccessInformation.rolesGranted, role],
            rolesRestricted: [
              ...resourceAccessInformation.rolesRestricted.filter(
                (restrictedRole) => restrictedRole !== role,
              ),
            ],
          },
        },
      }),
      {
        loading: 'Granting access',
        success: 'Access granted',
        error: 'Could not grant access',
      },
    )
  }

  return (
    <>
      {!!resourceAccessInformation.rolesGranted.length && (
        <ModalLabel>Access</ModalLabel>
      )}
      {resourceAccessInformation.rolesGranted.map((role, index) => (
        <AccessListItem key={role} access spacing={index !== 0}>
          {UserRoleDisplayName(role)}
        </AccessListItem>
      ))}

      {!!resourceAccessInformation.rolesGranted.length && <Spacing top />}

      {!!resourceAccessInformation.rolesRestricted.length && (
        <ModalLabel>No access</ModalLabel>
      )}
      {resourceAccessInformation.rolesRestricted.map((role, index) => (
        <AccessListItem
          key={role}
          spacing={index !== 0}
          canGrant={restrictedByMe}
          onGrant={() => handleGrantAccess(role)}
        >
          {UserRoleDisplayName(role)}
        </AccessListItem>
      ))}
    </>
  )
}
