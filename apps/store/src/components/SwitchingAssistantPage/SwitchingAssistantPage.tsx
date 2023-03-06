import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { CheckoutHeader } from '@/components/CheckoutHeader/CheckoutHeader'
import { useBankSigneringApprovalCreateMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'

export type SwitchingAssistantPageProps = {
  checkoutSteps: Array<CheckoutStep>
  entries: Array<CancellableEntry>
  shopSessionId: string
}
type CancellableEntry = { offerId: string; name: string; date: string; company: string }

export const SwitchingAssistantPage = (props: SwitchingAssistantPageProps) => {
  const { checkoutSteps, entries, shopSessionId } = props
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('checkout')
  const formatter = useFormatter()

  const { showApolloError } = useAppErrorHandleContext()
  const router = useRouter()
  const [createApproval, result] = useBankSigneringApprovalCreateMutation({
    onCompleted(data) {
      datadogLogs.logger.info('Redirecting to BankSignering')
      router.push(data.bankSigneringApprovalCreate.url)
    },
    onError(error) {
      datadogLogs.logger.warn('Failed to create BankSignering approval', {
        error: error.message,
      })
      showApolloError(error)
    },
  })

  const handleClick = (productOfferId: string) => () => {
    datadogLogs.logger.addContext('productOfferId', productOfferId)
    datadogRum.addAction('initiateBankSignering', { productOfferId })
    createApproval({ variables: { productOfferId } })
  }

  return (
    <Space y={{ base: 1, lg: 2.5 }}>
      <Header>
        <CheckoutHeader steps={checkoutSteps} activeStep={CheckoutStep.SwitchingAssistant}>
          <TextLink
            href={PageLink.customerService({ locale: routingLocale })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text>{t('SWITCHING_ASSISTANT_SUPPORT_LINK')}</Text>
          </TextLink>
        </CheckoutHeader>
      </Header>
      <Wrapper y={{ base: 2, lg: 3.5 }}>
        <Heading as="h1" variant="standard.24" align="center">
          {t('SWITCHING_ASSISTANT_TITLE')}
        </Heading>
        <Main>
          <Space y={1.5}>
            <Space y={0.25}>
              {entries.map((item) => (
                <Card key={item.offerId}>
                  <Space y={1}>
                    <Pill>
                      <PillStatus />
                      <Text size="xs">
                        {t('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_PENDING')}
                      </Text>
                    </Pill>
                    <Space y={1}>
                      <div>
                        <Text>{[item.name, item.company].filter(Boolean).join(' · ')}</Text>
                        <Text color="textSecondary">
                          {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE', {
                            date: formatter.fromNow(new Date(item.date)),
                          })}
                        </Text>
                      </div>
                      <Button onClick={handleClick(item.offerId)} loading={result.loading}>
                        {t('SWITCHING_ASSISTANT_BANK_SIGNERING_LINK')}
                      </Button>
                    </Space>
                  </Space>
                </Card>
              ))}
            </Space>
            <Footer>
              <ButtonNextLink variant="ghost" href={PageLink.confirmation({ shopSessionId })}>
                {t('SWITCHING_ASSISTANT_SKIP_LINK')}
              </ButtonNextLink>
            </Footer>
          </Space>
        </Main>
      </Wrapper>
    </Space>
  )
}

const Wrapper = styled(Space)({
  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})

const Header = styled.header({
  paddingInline: theme.space.md,
})

const TextLink = styled(Link)({
  backgroundColor: theme.colors.light,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})

const Main = styled.main({
  paddingInline: theme.space.xs,
})

const Card = styled.div({
  padding: theme.space.md,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
})

const Pill = styled.div({
  backgroundColor: theme.colors.light,
  borderRadius: theme.radius.xs,
  paddingInline: theme.space.xs,
  paddingBlock: theme.space.xxs,
  display: 'inline-flex',
  gap: theme.space.xxs,
  alignItems: 'center',
})

const PillStatus = styled.div({
  height: theme.space.xs,
  width: theme.space.xs,
  borderRadius: '50%',
  backgroundColor: theme.colors.amber600,
})

const Footer = styled.footer({
  paddingInline: theme.space.md,
})
