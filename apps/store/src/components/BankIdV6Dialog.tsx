import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, type ReactNode } from 'react'
import { isMobile, isIOS } from 'react-device-detect'
import { Button, Text, Space, CheckIcon, BankIdIcon, WarningTriangleIcon, theme } from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'
import { BankIdOperation, BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'

export const BankIdV6Dialog = () => {
  const { t } = useTranslation('bankid')
  const { startLogin, cancelLogin, cancelCheckoutSign, currentOperation } = useBankIdContext()

  useTriggerBankIdOnSameDevice(currentOperation)

  let isOpen = !!currentOperation
  if (currentOperation?.type === 'sign') {
    // In some cases we show error and progress on signing page, not in dialog
    const isSigningAuthenticatedMember =
      currentOperation.customerAuthenticationStatus ===
      ShopSessionAuthenticationStatus.Authenticated
    const hasError = currentOperation.state === BankIdState.Error
    if (isSigningAuthenticatedMember || hasError) {
      isOpen = false
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && currentOperation) {
      const cancelCurrentOperation =
        currentOperation.type === 'login' ? cancelLogin : cancelCheckoutSign

      cancelCurrentOperation()
    }
  }

  let Content: ReactNode = null
  let Footer: ReactNode = null

  const { ssn } = currentOperation ?? {}
  if (currentOperation !== null && ssn) {
    switch (currentOperation.state) {
      case BankIdState.Idle: {
        // Sign operations don't need dialog in idle state
        if (currentOperation.type !== 'login') {
          break
        }

        Content = (
          <ContentWrapper maxWidth="35rem">
            <Text align="center">{t('LOGIN_BANKID')}</Text>
            <Text align="center" color="textSecondary" balance={true}>
              {t('LOGIN_BANKID_EXPLANATION')}
            </Text>
          </ContentWrapper>
        )
        Footer = (
          <>
            <BankIdLoginForm
              state={currentOperation.state}
              title={t('LOGIN_BUTTON_TEXT', { ns: 'common' })}
              onLoginStart={() => startLogin({ ssn })}
            />
            <Button variant="ghost" onClick={cancelLogin}>
              {t('LOGIN_BANKID_SKIP')}
            </Button>
          </>
        )
        break
      }

      case BankIdState.Starting:
      case BankIdState.Pending: {
        Content = (
          <ContentWrapper y={2}>
            <BankIdIcon color="blue900" size="4rem" />

            {currentOperation.qrCodeData ? (
              <QRCode size={200} value={currentOperation.qrCodeData} />
            ) : (
              <QRCodeSkeleton />
            )}

            <div>
              <Text color="textPrimary" align="center">
                {t('LOGIN_BANKID')}
              </Text>
              <Text color="textSecondary" align="center">
                {isMobile
                  ? t('LOGIN_BANKID_AUTHENTICATION_STEPS_MOBILE')
                  : t('LOGIN_BANKID_AUTHENTICATION_STEPS_DESKTOP')}
              </Text>
            </div>
          </ContentWrapper>
        )
        Footer = (
          <FullscreenDialog.Close asChild>
            <Button variant="ghost">{t('LOGIN_BANKID_CANCEL')}</Button>
          </FullscreenDialog.Close>
        )
        break
      }

      case BankIdState.Success: {
        Content = (
          <IconWithText>
            <CheckIcon size="1rem" color={theme.colors.signalGreenElement} />
            {currentOperation.type === 'login'
              ? t('LOGIN_BANKID_SUCCESS')
              : t('BANKID_MODAL_SUCCESS_PROMPT')}
          </IconWithText>
        )
        Footer = null
        break
      }

      case BankIdState.Error: {
        // Sign errors are shown elsewhere
        if (currentOperation.type !== 'login') {
          break
        }

        Content = (
          <ContentWrapper y={1}>
            <WarningTriangleIcon size="1.5rem" color={theme.colors.amber600} />

            <div>
              <Text color="textPrimary" align="center">
                {t('LOGIN_BANKID_FAIL_TITLE')}
              </Text>
              <Text color="textSecondary" align="center">
                {t('LOGIN_BANKID_FAIL_DESCRIPTION')}
              </Text>
            </div>

            <Button
              variant="primary"
              size="medium"
              onClick={() => startLogin({ ssn: currentOperation.ssn })}
            >
              {t('LOGIN_BANKID_TRY_AGAIN')}
            </Button>
          </ContentWrapper>
        )
        Footer = (
          <FullscreenDialog.Close asChild>
            <Button variant="ghost">{t('LOGIN_BANKID_CANCEL')}</Button>
          </FullscreenDialog.Close>
        )
        break
      }
    }
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <FullscreenDialog.Modal center={true} Footer={Footer}>
        {Content}
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const getBankIdUrl = (autoStartToken: string) => {
  // https://www.bankid.com/en/utvecklare/guider/teknisk-integrationsguide/programstart
  const bankidUrl = new URL('bankid:///')
  bankidUrl.searchParams.append('autostarttoken', autoStartToken)
  // 'null' means the BankID app will redirect back to the calling app.
  // It's recommended to set redirect to null when possible.
  // For IOS though, 'redirect' must have a value. '#bankid-auth' is a 'hack'
  // for returning to the same safari tab.
  bankidUrl.searchParams.append('redirect', isIOS ? `${window.location.href}#bankid-auth` : 'null')

  return bankidUrl.toString()
}

const useTriggerBankIdOnSameDevice = (bankIdOperation: BankIdOperation | null) => {
  // Avoids triggering BankID app opening multiple times
  const launchedRef = useRef(false)

  useEffect(() => {
    if (!isMobile) return

    const authenticationInProgress =
      bankIdOperation?.state === BankIdState.Starting ||
      bankIdOperation?.state === BankIdState.Pending

    if (authenticationInProgress && bankIdOperation.autoStartToken && !launchedRef.current) {
      window.open(getBankIdUrl(bankIdOperation.autoStartToken), '_self')
      launchedRef.current = true
    } else {
      launchedRef.current = false
    }
  }, [bankIdOperation?.state, bankIdOperation?.autoStartToken])
}

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const ContentWrapper = styled(Space)(({ maxWidth = '24rem' }: { maxWidth?: string }) => ({
  display: 'grid',
  justifyItems: 'center',
  width: `min(${maxWidth}, 100%)`,
  marginInline: 'auto',
}))

const QRCode = styled(QRCodeSVG)({
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.grayTranslucent200}`,
  backgroundColor: theme.colors.white,
})

const QRCodeSkeleton = styled(Skeleton)({
  width: 200,
  aspectRatio: '1 / 1',
})
