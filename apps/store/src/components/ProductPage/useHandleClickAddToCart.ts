import { useApolloClient } from '@apollo/client'
import { FormEventHandler } from 'react'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
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
  const [addEntry, { loading }] = useCartEntryAddMutation()
  const [refreshData, loadingData] = useRefreshData()
  const apolloClient = useApolloClient()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const pricedVariantId = getOrThrowFormValue(formData, FormElement.PricedVariant)

    await addEntry({ variables: { cartId, pricedVariantId } })

    priceIntentServiceInitClientSide({ shopSession, apolloClient }).clear(productName)
    // Refresh route since data is fetched server-side (product page)
    await refreshData()

    onSuccess()
  }

  return [handleSubmit, loadingData || loading] as const
}
