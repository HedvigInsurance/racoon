import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartCampaign, CartCost } from './CartInventory.types'

type Props = CartCost & { campaigns: CartCampaign[] }

export const CostSummary = ({ total, crossOut, campaigns }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  return (
    <SpaceBetweenWrapper>
      <Text size="md">{t('CHECKOUT_PRICE_TOTAL')}</Text>
      <SpaceFlex space={0.5}>
        <SpaceFlex direction="vertical" align="end" space={0}>
          <PriceWrapper>
            {crossOut && (
              <CrossOutText size="md" color="textSecondary">
                {formatter.monthlyPrice(crossOut)}
              </CrossOutText>
            )}
            <Text size="md">{formatter.monthlyPrice(total)}</Text>
          </PriceWrapper>
          {campaigns.map((item) => (
            <FlexEnd key={item.id}>
              <Text size="sm" color="textSecondary">
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

const PriceWrapper = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.space.xs,
})

const FlexEnd = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
})
