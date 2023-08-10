import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { CurrencyCode } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  currencyCode: CurrencyCode
  amount: number
  reducedAmount?: number
}

export const Price = (props: Props) => {
  const formatter = useFormatter()

  return (
    <Wrapper>
      {props.reducedAmount !== undefined && (
        <Text as="p" size="md" strikethrough={true} color="textSecondary">
          {formatter.monthlyPrice({
            amount: props.amount,
            currencyCode: props.currencyCode,
          })}
        </Text>
      )}

      <Text as="p" size="md">
        {formatter.monthlyPrice({
          currencyCode: props.currencyCode,
          amount: props.reducedAmount ?? props.amount,
        })}
      </Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  columnGap: theme.space.xs,
})
