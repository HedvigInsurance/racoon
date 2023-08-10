import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ChevronIcon, Text, theme } from 'ui'
import { CurrencyCode } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  expanded: boolean

  price: {
    currencyCode: CurrencyCode
    amount: number
    reducedAmount?: number
  }
}

export const ProductDetailsHeader = ({ expanded, price, ...radixProps }: Props) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <Wrapper {...radixProps}>
      <Trigger as="div">
        {t('VIEW_ENTRY_DETAILS_BUTTON')}
        <AnimatedChevronIcon
          size="1rem"
          color={theme.colors.textTertiary}
          data-state={expanded ? 'expanded' : 'collapsed'}
        />
      </Trigger>

      <Price>
        {price.reducedAmount !== undefined && (
          <Text as="p" size="md" strikethrough={true} color="textSecondary">
            {formatter.monthlyPrice(price)}
          </Text>
        )}

        <Text as="p" size="md">
          {formatter.monthlyPrice({
            ...price,
            amount: price.reducedAmount ?? price.amount,
          })}
        </Text>
      </Price>
    </Wrapper>
  )
}

const Wrapper = styled.button({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: theme.space.md,
})

const Trigger = styled(Text)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
})

const AnimatedChevronIcon = styled(ChevronIcon)({
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',
  ['&[data-state=expanded]']: { transform: 'rotate(180deg)' },
})

const Price = styled.div({
  display: 'flex',
  columnGap: theme.space.xs,
})
