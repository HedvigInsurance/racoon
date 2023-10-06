import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'
import { Button, Heading, Text } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { InfoCard } from '@/components/InfoCard/InfoCard'
import { ReadyState } from '@/components/PaymentConnectPage/ReadyState'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useMemberAreaInfo } from '@/features/memberArea/useMemberAreaInfo'
import { useMemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useFormatter } from '@/utils/useFormatter'

export const PaymentsSection = () => {
  return (
    <SpaceFlex direction="vertical">
      <GeneralInfo />
      <InsuranceCost />
      <PaymentConnection />
      {/* NOTE that URL is locale-specific */}
      <ButtonNextLink href={'/se-en/help/faq'} locale={false} size="small" variant="secondary">
        Payments FAQ
      </ButtonNextLink>
    </SpaceFlex>
  )
}

// Might be a CMS block in the future
const GeneralInfo = () => {
  return (
    <div style={{ maxWidth: '450px' }}>
      <InfoCard>
        At Hedvig, you pay at the end of the month for the current month. Your monthly payment is
        handled via digital direct debit on the 27th of every month (or the closest following bank
        day). We work with Trustly as our payment partner and you can connect your direct debit on
        this page below
      </InfoCard>
    </div>
  )
}

const InsuranceCost = () => {
  const { insuranceCost } = useMemberAreaInfo()
  const formatter = useFormatter()

  return (
    <>
      <Heading as="h3" variant="standard.24">
        Monthly cost
      </Heading>
      {insuranceCost.monthlyDiscount.amount > 0 && (
        <Text color="textSecondary" strikethrough={true}>
          {formatter.monthlyPrice(insuranceCost.monthlyGross)}
        </Text>
      )}
      <Text>{formatter.monthlyPrice(insuranceCost.monthlyNet)}</Text>
      {insuranceCost.freeUntil && (
        <Text>Free until {formatter.dateFull(insuranceCost.freeUntil)}</Text>
      )}
    </>
  )
}

const PaymentConnection = () => {
  const currentMember = useMemberAreaInfo()

  return (
    <>
      <Heading as="h3" variant="standard.24">
        Payment connection
      </Heading>
      {currentMember.hasActivePaymentConnection ? (
        <>
          <Text>✅&nbsp;Connected</Text>
          <PaymentConfiguration startButtonText="Change connection" />
        </>
      ) : (
        <>
          <Text>Not connected yet</Text>
          <PaymentConfiguration startButtonText="Connect" />
        </>
      )}
    </>
  )
}

type PaymentConfigurationState =
  | { type: 'IDLE' }
  | { type: 'LOADING' }
  | { type: 'ERROR' }
  | { type: 'READY'; trustlyUrl: string }

const PaymentConfiguration = ({ startButtonText }: { startButtonText: string }) => {
  const { routingLocale } = useCurrentLocale()
  const apolloClient = useApolloClient()
  // Not using simplified hook, we need access to refetch
  const { refetch } = useMemberAreaMemberInfoQuery()
  const [state, setState] = useState<PaymentConfigurationState>({ type: 'IDLE' })

  const handleStart = useCallback(async () => {
    try {
      const trustlyUrl = await createTrustlyUrl({ apolloClient, locale: routingLocale })
      setState({ type: 'READY', trustlyUrl })
    } catch (err: unknown) {
      console.warn('Failed to create Trustly URL', err)
      setState({ type: 'ERROR' })
    }
  }, [apolloClient, routingLocale])

  const handleTrustlyError = () => {
    window.alert('Something went wrong')
    setState({ type: 'IDLE' })
  }

  if (state.type === 'READY') {
    return (
      <div style={{ minWidth: '70vw' }}>
        <ReadyState
          trustlyUrl={state.trustlyUrl}
          onSuccess={async () => {
            await refetch()
            setState({ type: 'IDLE' })
          }}
          onFail={handleTrustlyError}
        />
      </div>
    )
  }
  return (
    <>
      <Button loading={state.type === 'LOADING'} size="small" onClick={handleStart}>
        {startButtonText}
      </Button>
      {state.type === 'ERROR' && <Text>Something went wrong, please try again</Text>}
    </>
  )
}
