import { FormEvent, useCallback } from 'react'
import { useCartLinesRemoveMutation } from '@/services/apollo/generated'
import { useGetCurrentShopSession } from '@/services/shopSession/ShopSession.hooks'

type Params = {
  lineId: string
  onSuccess: () => void
}

export const useHandleSubmitRemoveFromCart = ({ lineId, onSuccess }: Params) => {
  const getCurrentShopSession = useGetCurrentShopSession()
  const [removeLineItem, result] = useCartLinesRemoveMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const { cart } = await getCurrentShopSession()
      await removeLineItem({ variables: { lineItemId: lineId, cartId: cart.id } })
      onSuccess()
    },
    [getCurrentShopSession, removeLineItem, lineId, onSuccess],
  )

  return [handleSubmit, result] as const
}
