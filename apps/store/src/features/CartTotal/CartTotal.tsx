import { TotalPrice } from '@/components/TotalPrice/TotalPrice'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useCartTotal } from './hooks/useCartTotal'

type Props = {
  cart: ShopSession['cart']
}

export function CartTotal({ cart }: Props) {
  const { amount, reducedAmount, explanation } = useCartTotal({
    discount: cart.redeemedCampaign?.discount,
    cost: cart.cost,
  })

  return (
    <TotalPrice
      currencyCode={amount.currencyCode}
      amount={amount.amount}
      reducedAmount={reducedAmount}
      note={explanation}
    />
  )
}
