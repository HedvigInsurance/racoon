import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Space, Text, mq, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import { BankSigneringEvent } from '@/services/bankSignering'
import { useBankSigneringInitMutation } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import type { BankSigneringContract } from './useSwitchingContracts'

const BANK_SIGNERING_LOGGER = datadogLogs.createLogger('bankSignering')

type ContractCardProps = BankSigneringContract

export const ContractCard = (props: BankSigneringContract) => {
  return props.status.type === 'PENDING' ? (
    <PendingContractCard {...props} />
  ) : (
    <CompletedContractCard {...props} />
  )
}

const PendingContractCard = (props: ContractCardProps) => {
  const { t } = useTranslation('checkout')
  const formatter = useFormatter()

  const showError = useShowAppError()
  const [initiateBankSignering, result] = useBankSigneringInitMutation({
    refetchQueries: 'active',
    onCompleted(data) {
      const cancellation =
        data.contractBankSigneringCancellationInitiate.externalInsuranceCancellation
      if (!cancellation?.bankSignering?.url) {
        BANK_SIGNERING_LOGGER.warn('BankSignering url missing')
        showError(new Error(t('UNKNOWN_ERROR_MESSAGE', { ns: 'common' })))
      }
    },
    onError(error) {
      BANK_SIGNERING_LOGGER.warn('Failed to create BankSignering approval', {
        error: error.message,
      })
      showError(error)
    },
  })

  const handleClickInitiate = (contractId: string) => () => {
    datadogRum.addAction(BankSigneringEvent.Initiated, { contractId })
    // Logger context used in mutation result handlers
    BANK_SIGNERING_LOGGER.setContextProperty('contractId', contractId)
    initiateBankSignering({ variables: { contractId } })
  }

  const handleClickOpen = (contractId: string) => () => {
    datadogRum.addAction(BankSigneringEvent.Opened, { contractId })
  }

  return (
    <PendingCard>
      <Space y={1}>
        <PendingStatusPill>{t(props.status.messageKey)}</PendingStatusPill>
        <Space y={1}>
          <div>
            <Text>{props.displayName}</Text>
            <Text color="textTranslucentSecondary">
              {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE', {
                date: formatter.fromNow(new Date(props.approveByDate)),
              })}
            </Text>
          </div>
          {props.url ? (
            <ButtonNextLink
              href={props.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleClickOpen(props.id)}
              fullWidth={true}
            >
              {t('SWITCHING_ASSISTANT_BANK_SIGNERING_LINK')}
            </ButtonNextLink>
          ) : (
            <Button
              onClick={handleClickInitiate(props.id)}
              loading={result.loading}
              fullWidth={true}
            >
              {t('FLOW_ACTIVATION_BUTTON', { ns: 'common' })}
            </Button>
          )}
        </Space>
      </Space>
    </PendingCard>
  )
}

const CompletedContractCard = ({ status, displayName }: ContractCardProps) => {
  const { t } = useTranslation('checkout')

  return (
    <CompletedCard>
      <Space y={1}>
        <CompletedStatusPill>{t(status.messageKey)}</CompletedStatusPill>
        <div>
          <Text>{displayName}</Text>
          <Text color="textTranslucentSecondary">
            {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE_COMPLETED')}
          </Text>
        </div>
      </Space>
    </CompletedCard>
  )
}

const CARD_HEIGHT = '9.75rem'

const Card = styled.div({
  padding: theme.space.md,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  border: `0.5px solid ${theme.colors.borderTranslucent1}`,

  [mq.lg]: {
    padding: theme.space.lg,
  },
})

const PendingCard = styled(Card)({ backgroundColor: theme.colors.signalAmberFill })

const CompletedCard = styled(Card)({ backgroundColor: theme.colors.signalGreenFill })

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
  height: `calc(${CARD_HEIGHT} + ${theme.space.md} * 2)`,
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,

  [mq.lg]: {
    height: `calc(${CARD_HEIGHT} + ${theme.space.lg} * 2)`,
  },
})

const Pill = styled.div({
  backgroundColor: theme.colors.light,
  borderRadius: theme.radius.xxs,
  paddingInline: theme.space.xs,
  paddingBlock: theme.space.xxs,
  display: 'inline-flex',
  gap: theme.space.xxs,
  alignItems: 'center',
})

const PendingPill = styled(Pill)({
  backgroundColor: theme.colors.signalAmberHighlight,
})

const CompletedPill = styled(Pill)({
  backgroundColor: theme.colors.signalGreenHighlight,
})

const PillStatus = styled.div<{ color: string }>(({ color }) => ({
  height: theme.space.sm,
  width: theme.space.sm,
  borderRadius: '50%',
  backgroundColor: color,
}))

type StatusPillProps = { children: string }

const PendingStatusPill = ({ children }: StatusPillProps) => {
  return (
    <PendingPill>
      <PillStatus color={theme.colors.amber600} />
      <Text color="textTranslucentPrimary" size="xs">
        {children}
      </Text>
    </PendingPill>
  )
}

const CompletedStatusPill = ({ children }: StatusPillProps) => {
  return (
    <CompletedPill>
      <PillStatus color={theme.colors.signalGreenElement} />
      <Text color="textTranslucentPrimary" size="xs">
        {children}
      </Text>
    </CompletedPill>
  )
}
