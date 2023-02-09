import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactElement, useCallback } from 'react'
import { BankIdIcon, Button, CheckIcon, Text, theme, WarningTriangleIcon } from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useBankIdLogin } from '@/services/bankId/useBankIdLogin'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const BankIdDialog = () => {
  const { t } = useTranslation('bankid')
  const { shopSession } = useShopSession()
  const { currentOperation, dispatch } = useBankIdContext()
  const isOpen =
    !!currentOperation &&
    // Don't open dialog when signing as authenticated member
    !(
      currentOperation.type == 'sign' &&
      shopSession?.customer?.authenticationStatus === ShopSessionAuthenticationStatus.Authenticated
    )

  const cancelCurrentOperation = useCallback(() => {
    currentOperation?.onCancel()
    dispatch({ type: 'cancel' })
  }, [currentOperation, dispatch])

  // TODO: Expose and handle errors
  const shopSessionId = shopSession?.id
  const ssn = shopSession?.customer?.ssn ?? ''
  const { startLogin, cancelLogin } = useBankIdLogin({
    shopSessionId,
    ssn,
    dispatch,
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      cancelCurrentOperation()
    }
  }

  let content: ReactElement | null = null
  let footer: ReactElement | null = null

  if (currentOperation !== null) {
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
        footer = (
          <Button variant="ghost" onClick={cancelLogin}>
            {t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}
          </Button>
        )
        break
      }
      case BankIdState.Success: {
        content = (
          <IconWithText>
            <CheckIcon size="1rem" color={theme.colors.greenElement} />
            {currentOperation.type === 'login'
              ? t('LOGIN_BANKID_SUCCESS')
              : t('BANKID_MODAL_SUCCESS_PROMPT')}
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
              {currentOperation.type === 'login'
                ? t('LOGIN_BANKID_SKIP')
                : t('BANKID_MODAL_CANCEL')}
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
