import { useApolloClient } from '@apollo/client'
import { FormEventHandler } from 'react'
import { useCartLinesAddMutation } from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { useRefreshData } from '@/utils/useRefreshData'
import { FormElement } from './ProductPage.constants'

type Params = {
  shopSession: ShopSession
  cartId: string
  productName: string
  onSuccess: () => void
}

export const useHandleSubmitAddToCart = ({
  shopSession,
  cartId,
  productName,
  onSuccess,
}: Params) => {
  const [addLineItems, { loading }] = useCartLinesAddMutation()
  const [refreshData, loadingData] = useRefreshData()
  const apolloClient = useApolloClient()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const lineItemId = getOrThrowFormValue(formData, FormElement.LineItem)

    await addLineItems({ variables: { cartId, lineItemId } })

    priceIntentServiceInitClientSide({ shopSession, apolloClient }).clear(productName)
    // Refresh route since data is fetched server-side (product page)
    await refreshData()

    onSuccess()
  }

  return [handleSubmit, loadingData || loading] as const
}
