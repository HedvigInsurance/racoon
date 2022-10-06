import { FormEventHandler } from 'react'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './ProductPage.constants'

type Params = {
  cartId: string
  onSuccess: (productOfferId: string) => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAddMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)

    const result = await addEntry({ variables: { cartId, offerId: productOfferId } })

    // @TODO: expose and handle errors from this mutation
    if (result.data?.cartEntriesAdd.cart) {
      onSuccess(productOfferId)
    }
  }

  return [handleSubmit, loading] as const
}
