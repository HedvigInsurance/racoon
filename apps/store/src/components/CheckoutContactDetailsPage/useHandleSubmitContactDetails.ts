import { FormEventHandler } from 'react'
import { useContactDetailsUpdateMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'

type Params = {
  checkoutId: string
  onSuccess: () => void
}

export const useHandleSubmitContactDetails = (params: Params) => {
  const { checkoutId, onSuccess } = params

  const [updateContactDetails, result] = useContactDetailsUpdateMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    await updateContactDetails({
      variables: {
        input: {
          checkoutId,
          email: getOrThrowFormValue(formData, 'email'),
          firstName: getOrThrowFormValue(formData, 'firstName'),
          lastName: getOrThrowFormValue(formData, 'lastName'),
          personalNumber: getOrThrowFormValue(formData, 'personalNumber'),
        },
      },
    })

    onSuccess()
  }

  return [handleSubmit, result] as const
}
