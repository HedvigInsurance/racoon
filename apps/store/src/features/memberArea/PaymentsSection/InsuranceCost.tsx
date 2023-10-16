import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { useFormatter } from '@/utils/useFormatter'
import { getPillowSrc } from '../InsuranceSection/InsuranceCard'
import { useMemberAreaInfo } from '../useMemberAreaInfo'

export const InsuranceCost = () => {
  const { insuranceCost, activeContracts } = useMemberAreaInfo()
  const formatter = useFormatter()
  const { t } = useTranslation('memberArea')
  const reducedAmount =
    insuranceCost.monthlyDiscount.amount > 0 ? insuranceCost.monthlyNet.amount : undefined

  return (
    <div style={{ width: '100%' }}>
      <Heading as="h3" variant="standard.24">
        {t('PAYMENTS_MONTLY_COST')}
      </Heading>
      {activeContracts.map((contract) => {
        return (
          <Row key={contract.id}>
            <Pillow
              size="small"
              src={getPillowSrc(contract.currentAgreement.productVariant.typeOfContract)}
            />
            <Text>{contract.currentAgreement.productVariant.displayName}</Text>
          </Row>
        )
      })}

      {insuranceCost.monthlyDiscount.amount > 0 && (
        <Row style={{ justifyContent: 'space-between' }}>
          <Text>{t('PAYMENTS_DISCOUNT_LABEL')}</Text>
          <Text>{formatter.monthlyPrice(insuranceCost.monthlyDiscount)}</Text>
        </Row>
      )}

      <Row style={{ justifyContent: 'space-between' }}>
        <Text>{t('PAYMENTS_TOTAL_LABEL')}</Text>
        <div>
          <Price
            currencyCode={insuranceCost.monthlyGross.currencyCode}
            amount={insuranceCost.monthlyGross.amount}
            reducedAmount={reducedAmount}
          />
        </div>
      </Row>

      {insuranceCost.freeUntil && (
        <Text>{`${t('PAYMENTS_FREE_UNTIL')} ${formatter.dateFull(insuranceCost.freeUntil)}`}</Text>
      )}
    </div>
  )
}

const Row = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.md,
  width: '100%',
  paddingBlock: theme.space.md,
  borderBottom: `1px solid ${theme.colors.gray200}`,
})
