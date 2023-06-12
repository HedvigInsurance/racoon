import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AndroidIcon, AppleIcon, Button, HedvigLogo, mq, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { LogoWrapper } from '../Header'
import {
  focusableStyles,
  MENU_BAR_HEIGHT_MOBILE,
  Navigation,
  NavigationPrimaryList,
} from '../HeaderStyles'
import { ShoppingCartMenuItem } from '../ShoppingCartMenuItem'

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
        <DialogTrigger>{t('NAV_MENU_DIALOG_OPEN')}</DialogTrigger>
        <DialogContent>
          <Wrapper>
            <TopMenuHeader>
              <div style={{ flex: 1 }}>
                <LogoWrapper href={PageLink.home()} aria-label={t('HOME_PAGE_LINK_LABEL')}>
                  <HedvigLogo />
                </LogoWrapper>
              </div>
              <DialogClose>{t('NAV_MENU_DIALOG_CLOSE')}</DialogClose>
              <ShoppingCartMenuItem />
            </TopMenuHeader>
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
          </Wrapper>
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

const Wrapper = styled.div({
  position: 'fixed',
  top: 0,
  width: '100%',
})

const TopMenuHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,
})

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
  top: 0,
  backgroundColor: theme.colors.light,
})
