import { DetailsList } from '@/components/DetailsList/DetailsList'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  cart: ShopSession['cart']
}

export function OrderBreakdown({ cart }: Props) {
  const formatter = useFormatter()

  const cartEntries = cart.entries.map((entry) => ({
    id: entry.product.id,
    name: entry.product.displayNameFull,
    price: entry.cost.net,
  }))

  return (
    <DetailsList.Root>
      {cartEntries.map((entry) => (
        <DetailsList.Item key={entry.id}>
          <DetailsList.Label>{entry.name}</DetailsList.Label>
          <DetailsList.Value>
            {formatter.monthlyPrice({
              currencyCode: entry.price.currencyCode,
              amount: entry.price.amount,
            })}
          </DetailsList.Value>
        </DetailsList.Item>
      ))}
    </DetailsList.Root>
  )
}
