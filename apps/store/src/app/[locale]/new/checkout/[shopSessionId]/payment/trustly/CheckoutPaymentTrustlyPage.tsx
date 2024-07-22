'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Text, yStack, theme } from 'ui'
import { CheckIcon } from '@/components/ComparisonTable/ComparisonTable'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { successState, content } from './CheckoutPaymentTrustlyPage.css'

const datadogLogger = datadogLogs.createLogger('trustly')

export type Props = {
  shopSessionId: string
  trustlyUrl: string
  nextUrl: string
}

export function CheckoutPaymentTrustlyPage({ shopSessionId, trustlyUrl, nextUrl }: Props) {
  const [isSuccess, setIsSuccess] = useState(false)

  const { t } = useTranslation('checkout')
  const router = useRouter()

  const handleSuccess = () => {
    datadogLogger.info('Checkout | Trustly payment success', { shopSessionId: shopSessionId })
    setIsSuccess(true)
    router.push(nextUrl)
  }

  const handleFail = () => {
    datadogLogger.warn('Checkout | Trustly payment failed', { shopSessionId: shopSessionId })
    router.push(nextUrl)
  }

  if (isSuccess) {
    return (
      <div className={successState}>
        <CheckIcon color={theme.colors.signalGreenElement} />
        <Text>{t('PAYMENT_TRUSTLY_SUCCESS_MESSAGE')}</Text>
      </div>
    )
  }

  return (
    <GridLayout.Root>
      <GridLayout.Content className={content} width="1/3" align="center">
        <div className={yStack({ gap: 'lg' })}>
          <TrustlyIframe
            style={{ width: 'min(29rem, 100%)', height: 'min(32rem, 60vh)' }}
            url={trustlyUrl}
            onSuccess={handleSuccess}
            onFail={handleFail}
          />

          <Text balance size="xs" color="textSecondary" align="center">
            {t('PAYMENT_TRUSTLY_FOOTNOTE')}
          </Text>
        </div>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
