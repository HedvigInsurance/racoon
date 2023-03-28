import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Space, Text, theme } from 'ui'
import { useBankSigneringInitMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useFormatter } from '@/utils/useFormatter'
import { BankSigneringContract } from './useSwitchingContracts'

const BANK_SIGNERING_LOGGER = datadogLogs.createLogger('bankSignering')

type ContractCardProps = BankSigneringContract

export const ContractCard = (props: BankSigneringContract) => {
  return props.status.type === 'PENDING' ? (
    <PendingContractCard {...props} />
  ) : (
    <CompletedContractCard {...props} />
  )
}

const PendingContractCard = ({
  id,
  status,
  displayName,
  company,
  approveByDate,
}: ContractCardProps) => {
  const { t } = useTranslation('checkout')
  const formatter = useFormatter()
  const windowRef = useRef<Window | null>(null)

  const { showApolloError } = useAppErrorHandleContext()
  const [initiateBankSignering, result] = useBankSigneringInitMutation({
    onCompleted(data) {
      BANK_SIGNERING_LOGGER.info('Redirecting to BankSignering')
      const cancellation =
        data.contractBankSigneringCancellationInitiate.externalInsuranceCancellation
      const bankSigneringUrl = cancellation?.bankSignering?.url

      if (windowRef.current && bankSigneringUrl) {
        windowRef.current.location = bankSigneringUrl
      }
    },
    onError(error) {
      BANK_SIGNERING_LOGGER.warn('Failed to create BankSignering approval', {
        error: error.message,
      })
      windowRef.current?.close()
      showApolloError(error)
    },
  })

  const handleClick = (contractId: string) => () => {
    datadogRum.addAction('initiateBankSignering', { contractId })
    // Logger context used in mutation result handlers
    BANK_SIGNERING_LOGGER.addContext('contractId', contractId)
    // Ref: https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
    windowRef.current = window.open(undefined, '_blank')
    initiateBankSignering({ variables: { contractId } })
  }

  return (
    <Card>
      <Space y={1}>
        <PendingStatusPill>{status.message}</PendingStatusPill>
        <Space y={1}>
          <div>
            <Text>{[displayName, company].join(' · ')}</Text>
            <Text color="textSecondary">
              {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE', {
                date: formatter.fromNow(approveByDate),
              })}
            </Text>
          </div>
          <Button onClick={handleClick(id)} loading={result.loading}>
            {t('SWITCHING_ASSISTANT_BANK_SIGNERING_LINK')}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

const CompletedContractCard = ({ status, displayName, company }: ContractCardProps) => {
  const { t } = useTranslation('checkout')

  return (
    <Card>
      <Space y={1}>
        <CompletedStatusPill>{status.message}</CompletedStatusPill>
        <div>
          <Text>{[displayName, company].join(' · ')}</Text>
          <Text color="textSecondary">
            {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE_COMPLETED')}
          </Text>
        </div>
      </Space>
    </Card>
  )
}

const Card = styled.div({
  padding: theme.space.md,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
})

const pulsingAnimation = keyframes({
  '0%': {
    opacity: 0.5,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0.5,
  },
})

export const CardSkeleton = styled(Card)({
  height: '11.75rem',
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,
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

type StatusPillProps = { children: string }

const PendingStatusPill = ({ children }: StatusPillProps) => {
  return (
    <Pill>
      <PillStatus color={theme.colors.amber600} />
      <Text size="xs">{children}</Text>
    </Pill>
  )
}

const CompletedStatusPill = ({ children }: StatusPillProps) => {
  return (
    <Pill>
      <PillStatus color={theme.colors.greenElement} />
      <Text size="xs">{children}</Text>
    </Pill>
  )
}
