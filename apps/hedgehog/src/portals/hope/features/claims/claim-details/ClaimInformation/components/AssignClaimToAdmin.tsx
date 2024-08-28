import { useState } from 'react'
import * as React from 'react'
import {
  extractErrorMessage,
  Modal,
  SearchableDropdown,
  SecondLevelHeadline,
  useConfirmDialog,
} from '@hedvig-ui'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import gql from 'graphql-tag'
import {
  useAssignClaimToAdminMutation,
  useListClaimAssignedAdminsQuery,
} from 'types/generated/graphql'
import { useMe } from '@hope/features/user/hooks/use-me'
import toast from 'react-hot-toast'

gql`
  query ListClaimAssignedAdmins {
    listClaimAssignedAdmins {
      ...AdminSystemUser
    }
  }

  mutation AssignClaimToAdmin($claimId: ID!, $adminId: UUID) {
    claim_upsertAssignedAdminId(claimId: $claimId, assignedAdminId: $adminId) {
      ...ClaimDetails
    }
  }
`
type Props = {
  children: React.ReactNode
}

export const AssignClaimToAdmin = (props: Props) => {
  const { confirm } = useConfirmDialog()
  const [isActive, setIsActive] = useState(false)
  const { claimId, assignedAdmin: currentlyAssignedAdmin } = useClaim()
  const { me } = useMe()
  const { data } = useListClaimAssignedAdminsQuery()
  const isAssignedToMe = currentlyAssignedAdmin?.adminId === me.adminId
  const adminOptions = [
    {
      value: me.adminId,
      label: isAssignedToMe ? me.fullName : 'Assign to me',
    },
    ...(data?.listClaimAssignedAdmins
      ?.filter(({ adminId }) => adminId !== me.adminId)
      .map((admin) => ({
        value: admin.adminId,
        label: admin.name,
      })) ?? []),
  ]

  const [assignToAdminMutation] = useAssignClaimToAdminMutation()
  const assignToAdmin = (adminId: string | null) => {
    toast.promise(assignToAdminMutation({ variables: { claimId, adminId } }), {
      loading: adminId ? 'Assigning' : 'Unassigning',
      success: `Claim ${adminId ? 'assigned' : 'unassigned'}`,
      error: ({ message }) => extractErrorMessage(message),
    })
  }

  return (
    <>
      <Modal
        visible={isActive}
        onClose={() => setIsActive(false)}
        style={{ width: '30rem', padding: '1rem', overflow: 'visible' }}
      >
        <SecondLevelHeadline>Assign claim to admin</SecondLevelHeadline>
        <SearchableDropdown
          placeholder="Choose admin"
          isClearable={true}
          value={currentlyAssignedAdmin?.adminId}
          onChange={(option) =>
            assignToAdmin((option?.value as string) ?? null)
          }
          options={adminOptions}
        />
      </Modal>
      <div
        onClick={() =>
          confirm(
            'Continue if you want to set, change or remove admin from this claim',
            'success',
            'Continue',
          ).then(() => setIsActive(true))
        }
      >
        {props.children}
      </div>
    </>
  )
}
