import styled from '@emotion/styled'
import { Input, Label, Spacing } from '@hedvig-ui'
import { AccessListItem } from '@hope/features/resource-access/overview/components/Wrapper'
import { useMemo, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
  User,
  useRemoveResourceAccessMutation,
} from 'types/generated/graphql'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const ModalLabel = styled(Label)`
  font-size: 0.8rem;
`

export const UserAccessList: React.FC<{
  resourceAccessInformation: ResourceAccessInformation
}> = ({ resourceAccessInformation }) => {
  const [grantClaimAccess] = useGrantResourceAccessMutation()
  const [removeClaimAccess] = useRemoveResourceAccessMutation()
  const { restriction: { restrictedBy } = {} } = useClaim()

  const { resourceId, restrictedByMe } = resourceAccessInformation

  const [filterText, setFilterText] = useState('')
  const restrictedUsers = useMemo(
    () =>
      filterText
        ? resourceAccessInformation.usersRestricted.filter(({ fullName }) =>
            fullName.toLowerCase().includes(filterText.toLowerCase()),
          )
        : resourceAccessInformation.usersRestricted,

    [filterText, resourceAccessInformation.usersRestricted],
  )

  const handleGrantAccess = async (user: User) => {
    await toast.promise(
      grantClaimAccess({
        variables: {
          resourceId,
          grantHolder: user.id,
          grantHolderType: GrantHolderType.User,
        },
        optimisticResponse: {
          grantResourceAccess: {
            ...resourceAccessInformation,
            usersGranted: [...resourceAccessInformation.usersGranted, user],
            usersRestricted: [
              ...resourceAccessInformation.usersRestricted.filter(
                (restrictedUser) => restrictedUser.id !== user.id,
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

  const handleRemoveAccess = async (user: User) => {
    await toast.promise(
      removeClaimAccess({
        variables: {
          resourceId,
          grantHolder: user.id,
          grantHolderType: GrantHolderType.User,
        },
        optimisticResponse: {
          removeResourceAccess: {
            ...resourceAccessInformation,
            usersGranted: [
              ...resourceAccessInformation.usersGranted.filter(
                (grantedUser) => grantedUser.id !== user.id,
              ),
            ],
            usersRestricted: [
              ...resourceAccessInformation.usersRestricted,
              user,
            ],
          },
        },
      }),
      {
        loading: 'Removing access',
        success: 'Access removed',
        error: 'Could not remove access',
      },
    )
  }

  return (
    <>
      {!!resourceAccessInformation.usersGranted.length && (
        <ModalLabel>Access</ModalLabel>
      )}
      {resourceAccessInformation.usersGranted.map((user, index) => (
        <AccessListItem
          key={user.id}
          access
          spacing={index !== 0}
          isGrantHolder={user.id === restrictedBy?.id}
          canRemoveAccess={restrictedByMe}
          onRemoveAccess={() => handleRemoveAccess(user)}
        >
          {user.fullName}
        </AccessListItem>
      ))}

      {!!resourceAccessInformation.usersGranted.length && <Spacing top />}

      {!!resourceAccessInformation.usersRestricted.length && (
        <ModalLabel>No access</ModalLabel>
      )}

      <Input
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.currentTarget.value)}
      />
      <Spacing top="small" />
      {restrictedUsers.map((user, index) => (
        <AccessListItem
          key={user.id}
          spacing={index !== 0}
          canGrant={restrictedByMe}
          onGrant={() => handleGrantAccess(user)}
        >
          {user.fullName}
        </AccessListItem>
      ))}
    </>
  )
}
