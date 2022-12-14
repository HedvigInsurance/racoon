import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { I18nNamespace } from '@/utils/l10n/types'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { CartCost } from './CartInventory.types'

type Props = CartCost

export const CostSummary = ({ currencyCode, amount, crossOutAmount }: Props) => {
  const { t } = useTranslation(I18nNamespace.Cart)
  const formatCurrency = useCurrencyFormatter(currencyCode).format

  return (
    <SpaceBetween>
      <Text size="l">Totalt</Text>
      <SpaceFlex space={0.5}>
        {crossOutAmount && (
          <CrossOutText size="l" color="gray600">
            {t('MONTHLY_PRICE', {
              displayAmount: formatCurrency(crossOutAmount),
            })}
          </CrossOutText>
        )}
        <Text size="l">{t('MONTHLY_PRICE', { displayAmount: formatCurrency(amount) })}</Text>
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
