import gql from 'graphql-tag'
import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'
import { useConnectAppointmentToClaimMutation } from 'types/generated/graphql'
import toast from 'react-hot-toast'

gql`
  mutation ConnectAppointmentToClaim(
    $appointmentId: ID!
    $input: UpdateFirstVetAppointmentInput!
  ) {
    firstVetAppointment_update(appointmentId: $appointmentId, input: $input) {
      ...FirstVetAppointment
    }
  }
`

export const useClaimAppointmentConnection = () => {
  const [connectAppointmentToClaimMutation] =
    useConnectAppointmentToClaimMutation()
  const { confirm } = useConfirmDialog()

  const connectAppointmentToClaim = ({
    claimId,
    appointmentId,
  }: {
    claimId: string
    appointmentId: string
  }) => {
    return confirm('Connect appointment to claim?').then(() =>
      toast.promise(
        connectAppointmentToClaimMutation({
          variables: {
            appointmentId,
            input: {
              claim: {
                claimId,
              },
            },
          },
        }),
        {
          loading: 'Connecting',
          success: 'Connected',
          error: ({ message }) => extractErrorMessage(message),
        },
      ),
    )
  }

  const removeAppointmentFromClaim = ({
    appointmentId,
  }: {
    appointmentId: string
  }) => {
    return confirm('Remove appointment from claim?', 'danger', 'Remove').then(
      () =>
        toast.promise(
          connectAppointmentToClaimMutation({
            variables: {
              appointmentId,
              input: {
                claim: {
                  claimId: null,
                },
              },
            },
          }),
          {
            loading: 'Removing',
            success: 'Removed',
            error: ({ message }) => extractErrorMessage(message),
          },
        ),
    )
  }

  return {
    connectAppointmentToClaim,
    removeAppointmentFromClaim,
  }
}
