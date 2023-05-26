import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { type GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { ErrorDialog } from '@/components/PaymentConnectPage/ErrorDialog'
import { IdleState } from '@/components/PaymentConnectPage/IdleState'
import { ReadyState } from '@/components/PaymentConnectPage/ReadyState'
import { SuccessState } from '@/components/PaymentConnectPage/SuccessState'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

const LOGGER = datadogLogs.createLogger('payment-connect')

type State =
  | { type: 'IDLE' }
  | { type: 'READY'; trustlyUrl: string }
  | { type: 'SUCCESS' }
  | { type: 'FAILED'; trustlyUrl?: string }

const PaymentConnectPage = () => {
  const [state, setState] = useState<State>({ type: 'IDLE' })

  if (state.type === 'IDLE') {
    const handleCompleted = (trustlyUrl: string) => {
      setState({ type: 'READY', trustlyUrl })
    }

    const handleFailed = () => {
      setState({ type: 'FAILED' })
    }

    return <IdleState onCompleted={handleCompleted} onFailed={handleFailed} />
  }

  if (state.type === 'SUCCESS') {
    return <SuccessState />
  }

  const handleSuccess = () => {
    LOGGER.info('Payment Connect success')
    setState({ type: 'SUCCESS' })
  }

  const handleFail = () => {
    LOGGER.warn('Payment Connect failed')
    setState({ type: 'FAILED' })
  }

  const handleRetry = () => {
    datadogRum.addAction('Payment Connect Retry')
    if (state.trustlyUrl) {
      setState({ type: 'READY', trustlyUrl: state.trustlyUrl })
    } else {
      setState({ type: 'IDLE' })
    }
  }

  return (
    <>
      {state.trustlyUrl && (
        <ReadyState trustlyUrl={state.trustlyUrl} onSuccess={handleSuccess} onFail={handleFail} />
      )}

      <ErrorDialog open={state.type === 'FAILED'} onRetry={handleRetry} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }
  return { props: { ...(await serverSideTranslations(locale)) } }
}

export default PaymentConnectPage
