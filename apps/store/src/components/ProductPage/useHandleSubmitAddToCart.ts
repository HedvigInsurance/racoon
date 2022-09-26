import { FormEventHandler } from 'react'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'

type Params = {
  cartId: string
  onSuccess: (pricedVariantId: string) => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAddMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const pricedVariantId = getOrThrowFormValue(formData, 'pricedVariantId')

    const result = await addEntry({ variables: { cartId, pricedVariantId } })

    // @TODO: expose and handle errors from this mutation
    if (result.data?.cartEntriesAdd.cart) {
      onSuccess(pricedVariantId)
    }
  }

  return [handleSubmit, loading] as const
}
