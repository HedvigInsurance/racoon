import { useTranslation } from 'next-i18next'
import { Heading, Text } from 'ui'
import { Price } from '@/components/Price'
import { useFormatter } from '@/utils/useFormatter'
import { useMemberAreaInfo } from '../../useMemberAreaInfo'
import { row } from '../PaymentsSection.css'
import { costInfo } from './InsuranceCost.css'

export const InsuranceCost = () => {
  const { insuranceCost } = useMemberAreaInfo()
  const formatter = useFormatter()
  const { t } = useTranslation('memberArea')

  return (
    <div style={{ width: '100%' }}>
      <div className={costInfo}>
        <Heading as="h1" variant="standard.18">
          {t('PAYMENTS_MONTHLY_COST')}
        </Heading>
        <Price
          amount={insuranceCost.monthlyGross.amount}
          currencyCode={insuranceCost.monthlyGross.currencyCode}
        />
        <Text color="textSecondary">{t('PAYMENTS_MONTHLY_COST_BODY')}</Text>
      </div>

      {insuranceCost.monthlyDiscount.amount > 0 && (
        <div className={row}>
          <Text>{t('PAYMENTS_DISCOUNT_LABEL')}</Text>
          <Text>{formatter.monthlyPrice(insuranceCost.monthlyDiscount)}</Text>
        </div>
      )}

      {insuranceCost.freeUntil && (
        <Text>{`${t('PAYMENTS_FREE_UNTIL')} ${formatter.dateFull(insuranceCost.freeUntil)}`}</Text>
      )}
    </div>
  )
}
