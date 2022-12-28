import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartCampaign, CartCost } from './CartInventory.types'

type Props = CartCost & { campaigns: CartCampaign[] }

export const CostSummary = ({ total, crossOut, campaigns }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  if (!total) return null

  return (
    <SpaceBetweenWrapper>
      <Text size="l">{t('CHECKOUT_PRICE_TOTAL')}</Text>
      <SpaceFlex space={0.5}>
        <SpaceFlex direction="vertical" align="end" space={0}>
          <PriceWrapper>
            {crossOut && (
              <CrossOutText size="l" color="textSecondary">
                {formatter.monthlyPrice(crossOut)}
              </CrossOutText>
            )}
            <Text size="l">{formatter.monthlyPrice(total)}</Text>
          </PriceWrapper>
          {campaigns.map((item) => (
            <FlexEnd key={item.id}>
              <Text size="s" color="textSecondary">
                {item.discountDurationExplanation}
              </Text>
            </FlexEnd>
          ))}
        </SpaceFlex>
      </SpaceFlex>
    </SpaceBetweenWrapper>
  )
}

const SpaceBetweenWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const CrossOutText = styled(Text)({ textDecoration: 'line-through' })

const PriceWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.space[2],
}))

const FlexEnd = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
})
