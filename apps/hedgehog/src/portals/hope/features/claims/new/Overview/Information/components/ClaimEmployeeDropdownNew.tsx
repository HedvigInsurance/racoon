import { extractErrorMessage } from '@hedvig-ui'
import { Dropdown } from '@hedvig-ui/redesign'
import { useSetCoveringEmployeeMutation } from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import toast from 'react-hot-toast'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

gql`
  mutation SetCoveringEmployee($id: ID!, $coveringEmployee: Boolean!) {
    setCoveringEmployee(id: $id, coveringEmployee: $coveringEmployee) {
      id
      coveringEmployee
    }
  }
`

export const ClaimEmployeeDropdownNew = () => {
  const [setCoveringEmployee] = useSetCoveringEmployeeMutation()

  const { claimId, coveringEmployee } = useClaim()

  const options = [
    {
      value: 'True',
      label: 'Yes',
      selected: !!coveringEmployee,
      action: () => coverEmployeeHandler('True'),
    },
    {
      value: 'False',
      label: 'No',
      selected: !coveringEmployee,
      action: () => coverEmployeeHandler('False'),
    },
  ]

  const coverEmployeeHandler = (value: string) => {
    PushUserAction('claim', 'update', 'employee', null)

    toast.promise(
      setCoveringEmployee({
        variables: {
          id: claimId,
          coveringEmployee: value === 'True',
        },
        optimisticResponse: {
          setCoveringEmployee: {
            id: claimId,
            __typename: 'Claim',
            coveringEmployee: value === 'True',
          },
        },
      }),
      {
        loading: 'Setting covering employee...',
        success: 'Covering employee set',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return <Dropdown label="Employee claim" options={options} />
}
