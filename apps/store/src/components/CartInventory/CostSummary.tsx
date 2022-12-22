import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartCampaign, CartCost } from './CartInventory.types'

type Props = CartCost & { campaigns: CartCampaign[] }

export const CostSummary = ({ total, crossOut, campaigns }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  return (
    <SpaceBetweenWrapper>
      <Text size="l">{t('CHECKOUT_PRICE_TOTAL')}</Text>
      <SpaceFlex space={0.5}>
        <CostWrapper>
          <PriceWrapper>
            {crossOut && (
              <CrossOutText size="l" color="gray600">
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
        </CostWrapper>
      </SpaceFlex>
    </SpaceBetweenWrapper>
  )
}

const SpaceBetweenWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const CostWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
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
