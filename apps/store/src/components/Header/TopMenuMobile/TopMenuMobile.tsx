import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AndroidIcon, AppleIcon, Button, mq, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import {
  focusableStyles,
  MENU_BAR_HEIGHT_MOBILE,
  Navigation,
  NavigationPrimaryList,
} from '../HeaderStyles'

const triggerStyles = {
  ...focusableStyles,
  fontSize: theme.fontSizes.md,
  marginRight: theme.space.md,

  ':active': {
    color: theme.colors.textSecondary,
  },

  [mq.lg]: {
    display: 'none',
  },
}

export const DialogTrigger = styled(DialogPrimitive.Trigger)({
  ...triggerStyles,
})

export const DialogClose = styled(DialogPrimitive.DialogClose)({
  ...triggerStyles,
})

const ButtonWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.space.xs,
  paddingTop: theme.space.lg,
})

export type TopMenuMobileProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  defaultValue?: string
  children: React.ReactNode
}

export const TopMenuMobile = (props: TopMenuMobileProps) => {
  const { children, isOpen, setIsOpen, defaultValue } = props
  const router = useRouter()
  const { t } = useTranslation('common')
  const { routingLocale } = useCurrentLocale()

  useEffect(() => {
    const closeDialog = () => setIsOpen(false)
    router.events.on('routeChangeStart', closeDialog)
    return () => router.events.off('routeChangeStart', closeDialog)
  }, [router.events, setIsOpen])

  return (
    <>
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        {isOpen ? (
          <DialogClose>{t('NAV_MENU_DIALOG_CLOSE')}</DialogClose>
        ) : (
          <DialogTrigger>{t('NAV_MENU_DIALOG_OPEN')}</DialogTrigger>
        )}
        <DialogContent>
          <Navigation defaultValue={defaultValue}>
            <NavigationPrimaryList>
              <div>{children}</div>
              <ButtonWrapper>
                <Button
                  href={getAppStoreLink('apple', routingLocale).toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="medium"
                >
                  <SpaceFlex space={0.5} align="center">
                    <AppleIcon />
                    App Store
                  </SpaceFlex>
                </Button>
                <Button
                  href={getAppStoreLink('google', routingLocale).toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="medium"
                >
                  <SpaceFlex space={0.5} align="center">
                    <AndroidIcon />
                    Google Play
                  </SpaceFlex>
                </Button>
              </ButtonWrapper>
            </NavigationPrimaryList>
          </Navigation>
        </DialogContent>
      </DialogPrimitive.Root>
    </>
  )
}

export const DialogContent = (props: DialogPrimitive.DialogContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <StyledDialogOverlay />
      <DialogPrimitive.Content {...props} />
    </DialogPrimitive.Portal>
  )
}

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
  top: MENU_BAR_HEIGHT_MOBILE,
  backgroundColor: theme.colors.light,
})
