import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactElement } from 'react'
import { BankIdIcon, Button, Text, theme, TickIcon, WarningTriangleIcon } from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'

export const BankIdDialog = () => {
  const { t } = useTranslation('purchase-form')
  const { currentOperation, cancelCurrentOperation, startLogin } = useBankIdContext()
  const isOpen = !!currentOperation

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      cancelCurrentOperation()
    }
  }

  let content: ReactElement | null = null
  let footer: ReactElement | null = null

  if (currentOperation !== null) {
    console.debug('BankID dialog', currentOperation.type, currentOperation.state)
    switch (currentOperation.state) {
      case BankIdState.Idle: {
        content = (
          <>
            <Text align="center">{t('LOGIN_BANKID')}</Text>
            <Text align="center" color="textSecondary">
              {t('LOGIN_BANKID_EXPLANATION')}
            </Text>
          </>
        )
        footer = (
          <>
            <BankIdLoginForm
              state={currentOperation.state}
              title={t('LOGIN_BUTTON_TEXT', { ns: 'common' })}
              onLoginStart={startLogin}
            />
            <Button variant="ghost" onClick={cancelCurrentOperation}>
              {t('LOGIN_BANKID_SKIP')}
            </Button>
          </>
        )
        break
      }
      case BankIdState.Pending:
      case BankIdState.Starting: {
        content = (
          <>
            <IconWithText>
              <BankIdIcon />
              {t('LOGIN_BANKID_WAITING')}
            </IconWithText>
            <Text align="center" color="textSecondary">
              {currentOperation.state === BankIdState.Pending ? t('LOGIN_BANKID_OPEN_APP') : ''}
            </Text>
          </>
        )
        break
      }
      case BankIdState.Success: {
        content = (
          <IconWithText>
            <TickIcon size="1rem" color={theme.colors.greenElement} />
            {t('LOGIN_BANKID_SUCCESS')}
          </IconWithText>
        )
        break
      }
      case BankIdState.Error: {
        content = (
          <IconWithText>
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            <Text align="center">{t('LOGIN_BANKID_ERROR')}</Text>
          </IconWithText>
        )
        footer = (
          <>
            <BankIdLoginForm
              state={currentOperation.state}
              title={t('LOGIN_BANKID_TRY_AGAIN')}
              onLoginStart={startLogin}
            />
            <Button variant="ghost" onClick={cancelCurrentOperation}>
              {t('LOGIN_BANKID_SKIP')}
            </Button>
          </>
        )
        break
      }
    }
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <FullscreenDialog.Modal Footer={footer}>
        <ContentWrapper>{content}</ContentWrapper>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const ContentWrapper = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
})

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
