import { Placeholder } from '@hedvig-ui'

type Money = {
  amount: number
  currency: string
}

export const ClaimMoneyDisplay = ({ money }: { money: Money }) => {
  const { amount, currency } = money
  if (!amount || !currency) {
    return <Placeholder>None</Placeholder>
  }

  return (
    <>
      {amount} {currency}
    </>
  )
}
