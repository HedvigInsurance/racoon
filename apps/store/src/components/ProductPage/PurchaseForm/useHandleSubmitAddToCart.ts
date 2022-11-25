import { FormEventHandler } from 'react'
import { useUpdateStartDate } from '@/components/ProductPage/PurchaseForm/useUpdateStartDate'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './PurchaseForm.constants'

type Params = {
  cartId: string
  onSuccess: (productOfferId: string) => void
}

// Temporary implementation, we should set startDate on priceIntent before adding to cart
export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAddMutation()
  const [updateStartDate, { loading: updateStateDateLoading }] = useUpdateStartDate({ cartId })

  // @TODO: expose and handle errors

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)
    const startDate = getOrThrowFormValue(formData, FormElement.StartDate)

    addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted(data) {
        if (data.cartEntriesAdd.cart) {
          updateStartDate({
            offerId: productOfferId,
            dateValue: startDate,
            onSuccess() {
              onSuccess(productOfferId)
            },
          })
        }
      },
    })
  }

  return [handleSubmit, loading || updateStateDateLoading] as const
}
