import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactElement, useCallback } from 'react'
import { BankIdIcon, Button, Text, theme, TickIcon, WarningTriangleIcon } from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useBankIdLogin } from '@/services/bankId/useBankIdLogin'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const BankIdDialog = () => {
  // TODO: Move texts to bankid namespace
  const { t } = useTranslation(['purchase-form', 'checkout'])
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
  const bankIdLogin = useBankIdLogin({
    shopSessionId,
    ssn,
    dispatch,
  })
  const startLogin = useCallback(async () => {
    try {
      await bankIdLogin()
      currentOperation?.onSuccess()
      dispatch({ type: 'success' })
    } catch (error) {
      currentOperation?.onError?.()
    }
  }, [currentOperation, dispatch, bankIdLogin])

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
            <Text align="center">{t('LOGIN_BANKID', { ns: 'purchase-form' })}</Text>
            <Text align="center" color="textSecondary">
              {t('LOGIN_BANKID_EXPLANATION', { ns: 'purchase-form' })}
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
              {t('LOGIN_BANKID_SKIP', { ns: 'purchase-form' })}
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
              {t('LOGIN_BANKID_WAITING', { ns: 'purchase-form' })}
            </IconWithText>
            <Text align="center" color="textSecondary">
              {currentOperation.state === BankIdState.Pending
                ? t('LOGIN_BANKID_OPEN_APP', { ns: 'purchase-form' })
                : ''}
            </Text>
          </>
        )
        break
      }
      case BankIdState.Success: {
        content = (
          <IconWithText>
            <TickIcon size="1rem" color={theme.colors.greenElement} />
            {currentOperation.type === 'login'
              ? t('LOGIN_BANKID_SUCCESS', { ns: 'purchase-form' })
              : t('BANKID_MODAL_SUCCESS_PROMPT', { ns: 'checkout' })}
          </IconWithText>
        )
        break
      }
      case BankIdState.Error: {
        content = (
          <IconWithText>
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            <Text align="center">{t('LOGIN_BANKID_ERROR', { ns: 'purchase-form' })}</Text>
          </IconWithText>
        )
        footer = (
          <>
            <BankIdLoginForm
              state={currentOperation.state}
              title={t('LOGIN_BANKID_TRY_AGAIN', { ns: 'purchase-form' })}
              onLoginStart={startLogin}
            />
            <Button variant="ghost" onClick={cancelCurrentOperation}>
              {currentOperation.type === 'login'
                ? t('LOGIN_BANKID_SKIP', { ns: 'purchase-form' })
                : t('BANKID_MODAL_CANCEL', { ns: 'checkout' })}
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
