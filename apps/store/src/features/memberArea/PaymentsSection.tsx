import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'
import { Button, Heading, Text } from 'ui'
import { ReadyState } from '@/components/PaymentConnectPage/ReadyState'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useMemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const PaymentsSection = () => {
  const { data, refetch } = useMemberAreaMemberInfoQuery()

  if (data == null) {
    console.warn('PaymentsSection expects data to be always present')
    return null
  }
  const { currentMember } = data

  return (
    <SpaceFlex direction="vertical">
      <Heading as="h3" variant="standard.24">
        Payment connection
      </Heading>
      {currentMember.hasActivePaymentConnection ? (
        <>
          <Text>✅&nbsp;Configured</Text>
          <PaymentConfiguration startButtonText={'Change'} onSuccess={refetch} />
        </>
      ) : (
        <>
          <Text>Not configured yet</Text>
          <PaymentConfiguration startButtonText="Configure" onSuccess={refetch} />
        </>
      )}
    </SpaceFlex>
  )
}

type PaymentConfigurationState =
  | { type: 'IDLE' }
  | { type: 'LOADING' }
  | { type: 'ERROR' }
  | { type: 'READY'; trustlyUrl: string }

const PaymentConfiguration = ({
  startButtonText,
  onSuccess,
}: {
  startButtonText: string
  onSuccess: () => void
}) => {
  const { routingLocale } = useCurrentLocale()
  const apolloClient = useApolloClient()
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
          onSuccess={onSuccess}
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
