import { useTranslation } from 'next-i18next'
import { Space, Text } from 'ui'
import { AttentionCard } from '@/components/InfoCard/InfoCard'
import { useMemberAreaInfo } from '@/features/memberArea/useMemberAreaInfo'
import { MemberPaymentConnectionStatus } from '@/services/graphql/generated'
import { InsuranceCost } from './InsuranceCost/InsuranceCost'
import { PaymentConnection } from './PaymentConnection'
import { row, wrapper } from './PaymentsSection.css'

export const PaymentsSection = () => {
  const currentMember = useMemberAreaInfo()
  const { t } = useTranslation('memberArea')
  const needsPaymentSetup =
    currentMember.paymentInformation.status === MemberPaymentConnectionStatus.NeedsSetup

  return (
    <div className={wrapper}>
      <Space y={0.5}>
        <InsuranceCost />

        {needsPaymentSetup ? (
          <Space y={0.5}>
            <AttentionCard>
              <Text as="p" color="signalAmberText" size="xs">
                {t('PAYMENTS_NOTIFICATION_MISSING_PAYMENT')}
              </Text>
            </AttentionCard>
            <PaymentConnection startButtonText={t('PAYMENTS_DIRECT_DEBIT_BUTTON')} />
          </Space>
        ) : (
          <div>
            <div className={row}>
              <Text size={{ _: 'sm', lg: 'md' }}>{t('PAYMENTS_PAYMENT_METHOD')}</Text>
              <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
                {t('PAYMENTS_AUTOGIRO_LABEL')}
              </Text>
            </div>

            <div className={row}>
              <Text size={{ _: 'sm', lg: 'md' }}>{t('PAYMENTS_ACCOUNT_LABEL')}</Text>
              <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
                {currentMember.paymentInformation.connection?.descriptor}
              </Text>
            </div>

            <div className={row}>
              <Text size={{ _: 'sm', lg: 'md' }}>{t('PAYMENTS_BANK_LABEL')}</Text>
              <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
                {currentMember.paymentInformation.connection?.displayName}
              </Text>
            </div>
            <PaymentConnection startButtonText={t('PAYMENTS_DIRECT_DEBIT_REPLACE_BUTTON')} />
          </div>
        )}
        <Text align="center" color="textSecondary" size="xs">
          {t('PAYMENTS_CONNECT_PAYMENT_DESCRIPTION')}
        </Text>
      </Space>
    </div>
  )
}
