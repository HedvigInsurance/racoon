import styled from '@emotion/styled'
import { CheckIcon, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { useAdyenTranslations } from '@/services/adyen/useAdyenTranslations'

const PaymentConnectLegacySuccessPage = () => {
  const { success } = useAdyenTranslations()

  return (
    <Layout title={success}>
      <Centered>
        <CheckIcon color={theme.colors.signalGreenElement} />
      </Centered>
    </Layout>
  )
}

const Centered = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.md,
})

export default PaymentConnectLegacySuccessPage
