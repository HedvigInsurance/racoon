import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { type ReactNode } from 'react'
import {
  Button,
  Text,
  Space,
  CheckIcon,
  BankIdIcon,
  WarningTriangleIcon,
  CrossIcon,
  theme,
  mq,
} from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLoginForm'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'

export const BankIdV6Dialog = () => {
  const { t } = useTranslation('bankid')
  const { startLogin, cancelLogin, cancelCheckoutSign, currentOperation } = useBankIdContext()

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
  let Header: ReactNode = null
  let Footer: ReactNode = null

  const { ssn } = currentOperation ?? {}
  if (currentOperation !== null && ssn) {
    switch (currentOperation.state) {
      case BankIdState.Idle: {
        // Sign operations don't need dialog in idle state
        if (currentOperation.type !== 'login') {
          break
        }

        Header = undefined
        Content = (
          <>
            <Text align="center">{t('LOGIN_BANKID')}</Text>
            <Text align="center" color="textSecondary">
              {t('LOGIN_BANKID_EXPLANATION')}
            </Text>
          </>
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
        Header = null
        Content = (
          <Wrapper y={2}>
            <CloseButton>
              <CrossIcon size="1rem" />
            </CloseButton>

            <BankIdIcon color="blue900" size="4rem" />

            {currentOperation.qrCodeData ? (
              <QRCode size={200} value={currentOperation.qrCodeData} level="M" />
            ) : (
              <QRCodeSkeleton />
            )}

            <Space y={6.5}>
              <div>
                <Text color="textPrimary" align="center">
                  {t('LOGIN_BANKID')}
                </Text>
                <Text as="p" color="textSecondary" align="center">
                  {t('LOGIN_BANKID_AUTHENTICATION_STEPS')}
                </Text>
              </div>

              <FullscreenDialog.Close asChild>
                <Button variant="ghost">{t('LOGIN_BANKID_CANCEL')}</Button>
              </FullscreenDialog.Close>
            </Space>
          </Wrapper>
        )
        Footer = null
        break
      }

      case BankIdState.Success: {
        Header = undefined
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

        Header = undefined
        Content = (
          <IconWithText>
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            <Text align="center">{t('LOGIN_BANKID_ERROR')}</Text>
          </IconWithText>
        )
        Footer = null
        break
      }
    }
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <FullscreenDialog.Modal center={true} Footer={Footer} Header={Header}>
        {Content}
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Wrapper = styled(Space)({
  position: 'relative',
  display: 'grid',
  justifyItems: 'center',
  width: '100%',
  height: '100%',
  paddingInline: theme.space.md,

  [mq.md]: {
    width: 'min(35.5rem, 100%)',
    paddingBlock: theme.space.xxl,
    paddingInline: theme.space[9],
    marginInline: 'auto',
    border: `1px solid ${theme.colors.borderTranslucent1}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.default,
    backgroundColor: theme.colors.backgroundStandard,
  },
})

const CloseButton = styled(FullscreenDialog.Close)({
  // Hide it on mobile
  display: 'none',

  [mq.md]: {
    display: 'rever',
    position: 'absolute',
    borderRadius: '50%',
    padding: theme.space.xs,
    backgroundColor: theme.colors.translucent1,
    backdropFilter: 'blur(30px)',
    cursor: 'pointer',
    zIndex: 1,
    top: theme.space.lg,
    right: theme.space.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.translucent2,
    },
  },
})

const QRCode = styled(QRCodeSVG)({
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.grayTranslucent200}`,
})

const QRCodeSkeleton = styled(Skeleton)({
  width: 200,
  aspectRatio: '1 / 1',
})
