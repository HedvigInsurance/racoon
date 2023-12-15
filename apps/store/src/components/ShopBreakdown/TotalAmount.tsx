import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text, theme } from 'ui'
import { Price } from '@/components/Price'
import { CurrencyCode } from '@/services/graphql/generated'

type Props = {
  currencyCode: CurrencyCode
  amount: number
  discount?: {
    reducedAmount: number
    explanation: string
  }
}

export const TotalAmount = (props: Props) => {
  const { t } = useTranslation('cart')
  return (
    <Wrapper>
      <FlexBetween>
        <Text>{t('CHECKOUT_PRICE_TOTAL')}</Text>
        <Price
          currencyCode={props.currencyCode}
          amount={props.amount}
          reducedAmount={props.discount?.reducedAmount}
        />
      </FlexBetween>
      {props.discount && (
        <Text size="xs" color="textSecondary" align="right">
          {props.discount.explanation}
        </Text>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingInline: theme.space.xxxs,
})

const FlexBetween = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: theme.space.md,
})
