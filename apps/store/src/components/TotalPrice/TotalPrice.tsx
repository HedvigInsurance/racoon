import { useTranslation } from 'next-i18next'
import { sprinkles, Text } from 'ui'
import { type CurrencyCode } from '@/services/graphql/generated'
import { DetailsList } from '../DetailsList/DetailsList'
import { Price } from '../Price'

type Props = {
  label?: string
  currencyCode: CurrencyCode
  amount: number
  reducedAmount?: number
  note?: string
}

export function TotalPrice({ label, currencyCode, amount, reducedAmount, note }: Props) {
  const { t } = useTranslation('cart')

  return (
    <DetailsList.Root size="md">
      <DetailsList.Item className={sprinkles({ color: 'textPrimary' })}>
        <DetailsList.Label>{label ?? t('CHECKOUT_PRICE_TOTAL')}</DetailsList.Label>
        <DetailsList.Value>
          <Price
            className={sprinkles({ justifyContent: 'flex-end' })}
            currencyCode={currencyCode}
            amount={amount}
            reducedAmount={reducedAmount}
          />
          {note ? (
            <Text size="sm" color="textSecondary">
              {note}
            </Text>
          ) : null}
        </DetailsList.Value>
      </DetailsList.Item>
    </DetailsList.Root>
  )
}
