import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Heading, Space, Text, theme } from 'ui'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { CheckoutHeader } from '@/components/CheckoutHeader/CheckoutHeader'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { SuccessState } from './SuccessState'

const LOGGER = datadogLogs.createLogger('trustly')

export type Props = {
  locale: RoutingLocale
  shopSessionId: string
  checkoutSteps: Array<CheckoutStep>
  trustlyUrl: string
  nextUrl: string
}

export const CheckoutPaymentTrustlyPage = (props: Props) => {
  const { t } = useTranslation('checkout')
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccess = () => {
    LOGGER.info('Trustly payment success', { shopSessionId: props.shopSessionId })
    setIsSuccess(true)
    router.push(props.nextUrl)
  }

  const handleFail = () => {
    LOGGER.warn('Trustly payment failed', { shopSessionId: props.shopSessionId })
    router.push(props.nextUrl)
  }

  if (isSuccess) {
    return <SuccessState />
  }

  return (
    <Space y={{ base: 1, lg: 2.5 }}>
      <CheckoutHeader steps={props.checkoutSteps} activeStep={CheckoutStep.Payment}>
        <TextLink
          href={PageLink.customerService({ locale: props.locale })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('PAYMENT_HEADER_HELP_LINK')}
        </TextLink>
      </CheckoutHeader>

      <Content>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={{ base: 2, lg: 3.5 }}>
              <Heading as="h1" variant="standard.24" align="center" balance={true}>
                {t('PAYMENT_TRUSTLY_MESSAGE')}
              </Heading>
              <Space y={0.75}>
                <TrustlyIframe
                  url={props.trustlyUrl}
                  onSuccess={handleSuccess}
                  onFail={handleFail}
                />
                <Text size="xs" align="center">
                  {t('PAYMENT_TRUSTLY_FOOTNOTE')}
                </Text>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>
      </Content>
    </Space>
  )
}

const Content = styled.div({ paddingBottom: theme.space.lg })

const TextLink = styled(Link)({
  backgroundColor: theme.colors.light,
  fontSize: theme.fontSizes.md,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})
