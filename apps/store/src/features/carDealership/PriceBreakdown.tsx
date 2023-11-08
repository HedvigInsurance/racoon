import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { CurrencyCode } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  amount: number
  crossedOverAmount?: number
  currencyCode: CurrencyCode
  title: string
  subTitle: string
  priceExplanation: string
}

export const PriceBreakdown = ({
  amount,
  crossedOverAmount,
  currencyCode,
  title,
  subTitle,
  priceExplanation,
}: Props) => {
  const formatter = useFormatter()
  const showCrossedOverAmount = crossedOverAmount !== undefined && crossedOverAmount > amount
  return (
    <div>
      <Row>
        <Text>{title}</Text>
        <Wrapper>
          {showCrossedOverAmount && (
            <Text as="p" size="md" strikethrough={true} color="textSecondary">
              {formatter.monthlyPrice({
                amount: crossedOverAmount,
                currencyCode: currencyCode,
              })}
            </Text>
          )}
          <Text as="p" size="md" color="textPrimary">
            {formatter.monthlyPrice({
              currencyCode: currencyCode,
              amount: amount,
            })}
          </Text>
        </Wrapper>
      </Row>

      <Row>
        <Text size="xs" color="textSecondary">
          {subTitle}
        </Text>
        <Text size="xs" color="textSecondary">
          {priceExplanation}
        </Text>
      </Row>
    </div>
  )
}

const Row = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Wrapper = styled.div({
  display: 'flex',
  columnGap: theme.space.xs,
})
