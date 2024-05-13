import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { startTransition, useEffect, useState } from 'react'
import { AndroidIcon, AppleIcon, Button, theme } from 'ui'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/Header.constants'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { logoWrapper, navigation, navigationPrimaryList } from '../Header.css'
import { ShoppingCartMenuItem } from '../ShoppingCartMenuItem'

const ButtonWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.space.xs,
  paddingTop: theme.space.lg,
})

export type TopMenuMobileProps = {
  defaultValue?: string
  children: ReactNode
}

export const TopMenuMobile = (props: TopMenuMobileProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  // Close on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  // Poor man's useDeferredValue that waits for underlying dialog's display animation
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsContentVisible(isOpen))
    return () => clearTimeout(timeoutId)
  }, [isOpen])

  const { children, defaultValue } = props
  const { t } = useTranslation('common')
  const locale = useRoutingLocale()
  return (
    <>
      <DialogPrimitive.Root
        defaultOpen={false}
        open={isOpen}
        onOpenChange={(newValue: boolean) => startTransition(() => setIsOpen(newValue))}
      >
        <DialogPrimitive.Trigger asChild={true}>
          <Button variant="ghost" size="medium">
            {t('NAV_MENU_DIALOG_OPEN')}
          </Button>
        </DialogPrimitive.Trigger>
        <DialogContent>
          <Wrapper>
            <TopMenuHeader>
              <div className={logoWrapper}>
                <LogoHomeLink />
              </div>
              <DialogPrimitive.Close asChild={true}>
                <Button variant="ghost" size="medium">
                  {t('NAV_MENU_DIALOG_CLOSE')}
                </Button>
              </DialogPrimitive.Close>
              <ShoppingCartMenuItem />
            </TopMenuHeader>
            {isContentVisible && (
              <NavigationMenuPrimitive.Root className={navigation} defaultValue={defaultValue}>
                <NavigationMenuPrimitive.List className={navigationPrimaryList}>
                  <div>{children}</div>
                  <ButtonWrapper>
                    <Button
                      as="a"
                      href={getAppStoreLink('apple', locale).toString()}
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
                      as="a"
                      href={getAppStoreLink('google', locale).toString()}
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
                </NavigationMenuPrimitive.List>
              </NavigationMenuPrimitive.Root>
            )}
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
  color: theme.colors.textPrimary,
})

const TopMenuHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,
  gap: theme.space.xs,
})

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
  top: 0,
  backgroundColor: theme.colors.light,
})
