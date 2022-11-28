import { FormEventHandler } from 'react'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './PurchaseForm.constants'

type Params = {
  cartId: string
  priceIntentId: string
  onSuccess: (productOfferId: string) => void
}

// Temporary implementation, we should set startDate on priceIntent before adding to cart
export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAddMutation()

  // @TODO: expose and handle errors
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)

    addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted(data) {
        if (data.cartEntriesAdd.cart) {
          onSuccess(productOfferId)
        }
      },
    })
  }

  return [handleSubmit, loading] as const
}
