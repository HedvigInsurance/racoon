import { FormEventHandler } from 'react'
import { useCartLinesAddMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'

type Params = {
  cartId: string
  onSuccess: () => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addLineItems, result] = useCartLinesAddMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const lineItemId = getOrThrowFormValue(formData, 'lineItemId')

    await addLineItems({ variables: { cartId, lineItemId } })
    onSuccess()
  }

  return [handleSubmit, result] as const
}
