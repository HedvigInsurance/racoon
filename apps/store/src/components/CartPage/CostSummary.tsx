import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { I18nNamespace } from '@/utils/l10n/types'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { CostData } from './CartPageProps.types'

type Props = {
  cost: CostData
}

export const CostSummary = ({ cost }: Props) => {
  const { t } = useTranslation(I18nNamespace.Cart)
  const currencyFormatter = useCurrencyFormatter(cost.currencyCode)

  return (
    <SpaceBetween>
      <Text size="l">Totalt</Text>
      <SpaceFlex space={0.5}>
        {cost.crossOut && (
          <CrossOutText size="l" color="gray600">
            {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(cost.crossOut) })}
          </CrossOutText>
        )}
        <Text size="l">
          {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(cost.net) })}
        </Text>
      </SpaceFlex>
    </SpaceBetween>
  )
}

const SpaceBetween = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const CrossOutText = styled(Text)({ textDecoration: 'line-through' })
