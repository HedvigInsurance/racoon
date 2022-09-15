import { FormEventHandler } from 'react'
import { useContactDetailsUpdateMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './CheckoutContactDetailsPage.constants'

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
          email: getOrThrowFormValue(formData, FormElement.Email),
          firstName: getOrThrowFormValue(formData, FormElement.FirstName),
          lastName: getOrThrowFormValue(formData, FormElement.LastName),
          personalNumber: getOrThrowFormValue(formData, FormElement.PersonalNumber),
        },
      },
    })

    onSuccess()
  }

  return [handleSubmit, result] as const
}
