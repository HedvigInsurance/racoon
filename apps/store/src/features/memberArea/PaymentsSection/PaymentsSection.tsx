import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Text } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { InfoCard } from '@/components/InfoCard/InfoCard'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useMemberAreaInfo } from '@/features/memberArea/useMemberAreaInfo'
import { MemberPaymentConnectionStatus } from '@/services/graphql/generated'
import { CONTENT_WIDTH } from '../InsuranceSection/InsurancesSection'
import { InsuranceCost } from './InsuranceCost'
import { PaymentConnection } from './PaymentConnection'

export const PaymentsSection = () => {
  const currentMember = useMemberAreaInfo()
  const { t } = useTranslation('memberArea')

  const needsPaymentSetup =
    currentMember.paymentInformation.status === MemberPaymentConnectionStatus.NeedsSetup

  return (
    <Wrapper direction="vertical">
      <InsuranceCost />

      <Heading as="h3" variant="standard.24">
        {t('PAYMENTS_CONNECTION_TITLE')}
      </Heading>
      {needsPaymentSetup ? (
        <>
          <Text>{t('PAYMENTS_PAYMENT_NOT_CONNECTED')}</Text>
          <PaymentConnection startButtonText="Connect" />
        </>
      ) : (
        <>
          <Text>✅&nbsp;{t('PAYMENTS_PAYMENT_CONNECTED')}</Text>
          <PaymentConnection startButtonText="Change connection" />
        </>
      )}

      {/* NOTE that URL is locale-specific */}
      <ButtonNextLink href={'/se-en/help/faq'} locale={false} size="small" variant="secondary">
        Payments FAQ
      </ButtonNextLink>
      <GeneralInfo />
    </Wrapper>
  )
}

// Might be a CMS block in the future
const GeneralInfo = () => {
  return (
    <InfoCard>
      At Hedvig, you pay at the end of the month for the current month. Your monthly payment is
      handled via digital direct debit on the 27th of every month (or the closest following bank
      day). We work with Trustly as our payment partner and you can connect your direct debit on
      this page below
    </InfoCard>
  )
}

const Wrapper = styled(SpaceFlex)({
  width: '100%',
  maxWidth: CONTENT_WIDTH,
})
