'use client'
import { datadogRum } from '@datadog/browser-rum'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, type ReactNode } from 'react'
import { isMobile, isIOS } from 'react-device-detect'
import {
  Button,
  type ButtonProps,
  Text,
  Space,
  CheckIcon,
  BankIdIcon,
  WarningTriangleIcon,
  theme,
} from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'
import { SIGN_FORM_ID } from '@/constants/sign.constants'
import { BankIdOperation, BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'
import { wait } from '@/utils/wait'
import {
  qrCode,
  qrCodeSkeleton,
  iconWithText,
  contentWrapper,
  contentWrapperMaxWidth,
  qrOnAnotherDeviceFooter,
  qrOnAnotherDeviceLink,
} from './BankIdV6Dialog.css'

export const BankIdV6Dialog = () => {
  const { t } = useTranslation('bankid')
  const { startLogin, cancelLogin, cancelCheckoutSign, currentOperation } = useBankIdContext()

  useTriggerBankIdOnSameDevice(currentOperation)
  const tryAgainButtonProps = useTryAgainButtonProps(currentOperation)

  let isOpen = !!currentOperation
  if (currentOperation?.type === 'sign') {
    // In some cases we show progress on signing page, not in dialog
    const isSigningAuthenticatedMember =
      currentOperation.customerAuthenticationStatus ===
      ShopSessionAuthenticationStatus.Authenticated
    if (isSigningAuthenticatedMember) {
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
          <div
            className={contentWrapper}
            style={assignInlineVars({
              [contentWrapperMaxWidth]: '35rem',
            })}
          >
            <Text align="center">{t('LOGIN_BANKID')}</Text>
            <Text align="center" color="textSecondary" balance={true}>
              {t('LOGIN_BANKID_EXPLANATION')}
            </Text>
          </div>
        )
        Footer = (
          <>
            <BankIdLoginForm
              state={currentOperation.state}
              title={t('LOGIN_BUTTON_TEXT', { ns: 'common' })}
              onLoginStart={() =>
                startLogin({
                  ssn,
                  // So use can see sucess screen
                  onSuccess: () => wait(1500),
                })
              }
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
          <Space className={contentWrapper} y={2}>
            <BankIdIcon color="blue900" size="4rem" />

            {currentOperation.qrCodeData ? (
              <QRCodeSVG className={qrCode} size={200} value={currentOperation.qrCodeData} />
            ) : (
              <Skeleton className={qrCodeSkeleton} />
            )}

            <Space y={1.5}>
              <div>
                {currentOperation.bankidAppOpened ? (
                  <>
                    <Text color="textPrimary" align="center">
                      {t('QR_CODE_READ_TITLE')}
                    </Text>
                    <Text color="textSecondary" align="center">
                      {t('QR_CODE_READ_SUBTITLE')}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="textPrimary" align="center">
                      {currentOperation.type === 'login' ? t('LOGIN_BANKID') : t('SIGN_BANKID')}
                    </Text>
                    <Text color="textSecondary" align="center" balance={true}>
                      {isMobile
                        ? t('LOGIN_BANKID_AUTHENTICATION_STEPS_MOBILE')
                        : t('LOGIN_BANKID_AUTHENTICATION_STEPS_DESKTOP')}
                    </Text>
                  </>
                )}
              </div>

              <FullscreenDialog.Close asChild>
                <Button variant="ghost">{t('BANKID_CANCEL')}</Button>
              </FullscreenDialog.Close>
            </Space>
          </Space>
        )
        Footer =
          !isMobile && currentOperation.autoStartToken ? (
            <div className={qrOnAnotherDeviceFooter}>
              <Text>{t('NO_MOBILE_BANKID_TITLE')}</Text>
              <Link
                className={qrOnAnotherDeviceLink}
                href={getBankIdUrl(currentOperation.autoStartToken)}
                target="_self"
              >
                {t('NO_MOBILE_BANKID_LINK_LABEL')}
              </Link>
            </div>
          ) : null
        break
      }

      case BankIdState.Success: {
        Content = (
          <Text className={iconWithText}>
            <CheckIcon size="1rem" color={theme.colors.signalGreenElement} />
            {currentOperation.type === 'login'
              ? t('LOGIN_BANKID_SUCCESS')
              : t('BANKID_MODAL_SUCCESS_PROMPT')}
          </Text>
        )
        Footer = null
        break
      }

      case BankIdState.Error: {
        Content = (
          <Space className={contentWrapper} y={1}>
            <WarningTriangleIcon size="1.5rem" color={theme.colors.amber600} />

            {currentOperation.error ? (
              <Text align="center" size="md">
                {currentOperation.error}
              </Text>
            ) : (
              <Text align="center" size="md">
                {t('LOGIN_BANKID_ERROR')}
              </Text>
            )}

            <Button variant="primary" size="medium" {...tryAgainButtonProps}>
              {t('LOGIN_BANKID_TRY_AGAIN')}
            </Button>
          </Space>
        )
        Footer = (
          <FullscreenDialog.Close asChild>
            <Button variant="ghost">{t('BANKID_CANCEL')}</Button>
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
  // bankidUrl.searchParams.append('autostarttoken', autoStartToken)
  bankidUrl.searchParams.append('autostarttoken', "c3f8ee34-8c42-460f-84d0-a115d407e8da")
  // 'null' means the BankID app will redirect back to the calling app.
  // It's recommended to set redirect to null when possible.
  // For IOS though, 'redirect' must have a value. '#bankid-auth' is a 'hack'
  // for returning to the same safari tab.
  bankidUrl.searchParams.append('redirect', isIOS ? `${window.location.href}#bankid-auth` : 'null')

  return bankidUrl.toString()
}

const useTryAgainButtonProps = (bankIdOperation: BankIdOperation | null): Partial<ButtonProps> => {
  const { startLogin } = useBankIdContext()

  switch (bankIdOperation?.type) {
    case 'sign':
      return {
        type: 'submit',
        form: SIGN_FORM_ID,
        onClick: () => datadogRum.addAction('bankIdSign retry'),
      }
    case 'login':
      return {
        onClick: () => startLogin({ ssn: bankIdOperation.ssn }),
      }
    default:
      return {}
  }
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
