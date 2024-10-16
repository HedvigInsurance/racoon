'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, type ReactNode } from 'react'
import { isMobile, isIOS, isChrome, isFirefox, isOpera } from 'react-device-detect'
import {
  Button,
  type ButtonProps,
  Text,
  HedvigLogo,
  RoundCheckIcon,
  BankIdIcon,
  WarningTriangleIcon,
  yStack,
  theme,
  visuallyHidden,
  Card,
} from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { SIGN_FORM_ID } from '@/constants/sign.constants'
import type { BankIdOperation } from '@/services/bankId/bankId.types'
import { BankIdState } from '@/services/bankId/bankId.types'
import { bankIdLogger } from '@/services/bankId/bankId.utils'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { hedvigLogo, qrCodeSkeleton, contentWrapper, link } from './BankIdDialog.css'

export function BankIdDialog() {
  const { t } = useTranslation('bankid')
  const shopSessionId = useShopSessionId()
  const { cancelLogin, cancelCheckoutSign, currentOperation } = useBankIdContext()

  useTriggerBankIdOnSameDevice(currentOperation)
  const tryAgainButtonProps = useTryAgainButtonProps(currentOperation)

  const isOpen = !!currentOperation

  const handleOpenChange = (open: boolean) => {
    if (!open && currentOperation) {
      const cancelCurrentOperation =
        currentOperation.type === 'login' ? cancelLogin : cancelCheckoutSign
      cancelCurrentOperation()

      const logPrefix = currentOperation.type === 'login' ? 'Login' : 'Sign'
      const logMessageContext = shopSessionId ? { shopSessionId } : undefined
      bankIdLogger.info(`${logPrefix} | Operation cancelled`, logMessageContext)
    }
  }

  let Content: ReactNode = null
  let Footer: ReactNode = null

  if (currentOperation !== null) {
    switch (currentOperation.state) {
      case BankIdState.Starting:
      case BankIdState.Pending: {
        const dialogTitleText =
          currentOperation.type === 'login' ? t('LOGIN_BANKID') : t('SIGN_BANKID')

        Content = (
          <>
            <FullscreenDialog.Title className={visuallyHidden}>
              {dialogTitleText}
            </FullscreenDialog.Title>

            <div className={clsx(contentWrapper, yStack({ gap: 'lg' }))}>
              <div className={yStack({ alignItems: 'center', gap: 'xl' })}>
                <BankIdIcon color="black" size="4rem" />

                {currentOperation.qrCodeData ? (
                  <Card.Root size="md">
                    <QRCodeSVG size={200} value={currentOperation.qrCodeData} />
                  </Card.Root>
                ) : (
                  <Skeleton className={qrCodeSkeleton} />
                )}
              </div>

              <div className={yStack({ alignItems: 'center', gap: 'xl' })}>
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
                        {dialogTitleText}
                      </Text>
                      <Text color="textSecondary" align="center" balance={true}>
                        {t('BANKID_AUTHENTICATION_STEPS')}
                      </Text>
                    </>
                  )}
                </div>

                <FullscreenDialog.Close asChild>
                  <Button variant="secondary" size="medium">
                    {t('BANKID_CANCEL')}
                  </Button>
                </FullscreenDialog.Close>
              </div>
            </div>
          </>
        )
        Footer =
          !isMobile && currentOperation.autoStartToken ? (
            <div className={yStack({ alignItems: 'center' })}>
              <Text>{t('NO_MOBILE_BANKID_TITLE')}</Text>
              <Link
                className={link}
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
        const dialogTitleText =
          currentOperation.type === 'login'
            ? t('LOGIN_BANKID_SUCCESS')
            : t('BANKID_MODAL_SUCCESS_PROMPT')

        Content = (
          <>
            <FullscreenDialog.Title className={visuallyHidden}>
              {dialogTitleText}
            </FullscreenDialog.Title>

            <Text className={yStack({ alignItems: 'center', gap: 'md' })}>
              <RoundCheckIcon size="2rem" color={theme.colors.signalGreenElement} />
              {dialogTitleText}
            </Text>
          </>
        )
        Footer = null
        break
      }

      case BankIdState.Error: {
        Content = (
          <div className={clsx(contentWrapper, yStack({ alignItems: 'center', gap: 'md' }))}>
            <WarningTriangleIcon size="1.5rem" color={theme.colors.amber600} />

            {currentOperation.error ? (
              <Text align="center" size="md">
                {currentOperation.error}
              </Text>
            ) : (
              <Text align="center" size="md">
                {currentOperation.type === 'login'
                  ? t('LOGIN_BANKID_ERROR')
                  : t('SIGN_BANKID_ERROR')}
              </Text>
            )}

            <Button variant="primary" size="medium" {...tryAgainButtonProps}>
              {t('LOGIN_BANKID_TRY_AGAIN')}
            </Button>
          </div>
        )
        Footer = (
          <FullscreenDialog.Close asChild>
            <Button variant="ghost" fullWidth={true}>
              {t('BANKID_CANCEL')}
            </Button>
          </FullscreenDialog.Close>
        )
        break
      }
    }
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <FullscreenDialog.Modal
        center={true}
        Header={<HedvigLogo className={hedvigLogo} />}
        Footer={Footer}
      >
        {Content}
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

function getBankIdUrl(autoStartToken: string) {
  // https://www.bankid.com/en/utvecklare/guider/teknisk-integrationsguide/programstart
  const bankidUrl = new URL('bankid:///')
  bankidUrl.searchParams.append('autostarttoken', autoStartToken)
  bankidUrl.searchParams.append('redirect', getReturnURL())

  return bankidUrl.toString()
}

function getReturnURL() {
  // For IOS 'redirect' must have a value.
  if (isIOS) {
    if (isChrome) return 'googlechrome://'
    if (isFirefox) return 'firefox://'
    if (isOpera) return 'opera://'
    // For Safari or other browsers we return 'null' as well, even though there will be no redirect
    // for such cases. Instead user will have to manually go back to the app.
  }

  // In most cases 'null' means the BankID app will redirect back to the calling app.
  // It's recommended to set redirect to null when possible.
  return 'null'
}

function useTryAgainButtonProps(
  bankIdOperation: BankIdOperation | null,
): Partial<ButtonProps<'button'>> {
  const { startLogin } = useBankIdContext()

  switch (bankIdOperation?.type) {
    case 'sign':
      return {
        type: 'submit',
        form: SIGN_FORM_ID,
      }
    case 'login':
      return {
        onClick: () => startLogin({ ssn: bankIdOperation.ssn }),
      }
    default:
      return {}
  }
}

function useTriggerBankIdOnSameDevice(bankIdOperation: BankIdOperation | null) {
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
