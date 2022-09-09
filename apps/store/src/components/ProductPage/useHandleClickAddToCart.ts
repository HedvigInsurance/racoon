import { FormEventHandler } from 'react'
import { useCartLinesAddMutation } from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { useRefreshData } from '@/utils/useRefreshData'

type Params = {
  cartId: string
  onSuccess: () => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addLineItems, { loading }] = useCartLinesAddMutation()
  const [refreshData, loadingData] = useRefreshData()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const lineItemId = getOrThrowFormValue(formData, 'lineItemId')

    await addLineItems({ variables: { cartId, lineItemId } })

    priceIntentServiceInitClientSide().reset()
    // Refresh route since data is fetched server-side (product page)
    await refreshData()

    onSuccess()
  }

  return [handleSubmit, loadingData || loading] as const
}
