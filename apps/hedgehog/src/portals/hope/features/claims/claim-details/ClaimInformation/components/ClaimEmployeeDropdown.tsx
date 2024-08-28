import { Dropdown, DropdownOption, extractErrorMessage } from '@hedvig-ui'
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

export const ClaimEmployeeDropdown = () => {
  const [setCoveringEmployee] = useSetCoveringEmployeeMutation()

  const { claimId, coveringEmployee } = useClaim()

  const options = [
    {
      key: 0,
      value: 'True',
      text: 'True',
      selected: !!coveringEmployee,
    },
    { key: 1, value: 'False', text: 'False', selected: !coveringEmployee },
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

  return (
    <Dropdown>
      {options.map((option) => (
        <DropdownOption
          key={option.key}
          selected={option.selected}
          onClick={() => coverEmployeeHandler(option.value)}
        >
          {option.text}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
