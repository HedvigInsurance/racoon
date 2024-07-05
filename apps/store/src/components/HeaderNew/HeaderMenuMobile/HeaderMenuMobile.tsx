import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { startTransition, useEffect, useState } from 'react'
import { AndroidIcon, AppleIcon, Button, tokens } from 'ui'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { logoWrapper, navigation, navigationPrimaryList } from '../Header.css'
import { ShoppingCartMenuItem } from '../ShoppingCartMenuItem/ShoppingCartMenuItem'
import {
  buttonTrigger,
  buttonWrapper,
  contentWrapper,
  dialogOverlay,
  HeaderMenuHeader,
} from './HeaderMenuMobile.css'

type Props = {
  defaultValue?: string
  children: ReactNode
}

export function HeaderMenuMobile(props: Props) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)

  // Close on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Poor man's useDeferredValue that waits for the next UI frame
  // Waiting for next render loop is too early since major part of rendering work happens
  // in `Presence` inner component after dialog content is rendered
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsContentVisible(isOpen))
    return () => clearTimeout(timeoutId)
  }, [isOpen])

  const { children, defaultValue } = props
  const { t } = useTranslation('common')
  const locale = useRoutingLocale()

  return (
    <DialogPrimitive.Root
      defaultOpen={false}
      open={isOpen}
      onOpenChange={(newValue: boolean) => startTransition(() => setIsOpen(newValue))}
    >
      <DialogPrimitive.Trigger asChild={true}>
        <Button
          className={buttonTrigger}
          variant="ghost"
          size="medium"
          aria-label={t('NAV_MENU_DIALOG_OPEN')}
        >
          <MobileMenuOpenIcon />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogContent>
        <div className={contentWrapper}>
          <div className={HeaderMenuHeader}>
            <div className={logoWrapper}>
              <LogoHomeLink />
            </div>
            <DialogPrimitive.Close asChild={true}>
              <Button
                className={buttonTrigger}
                variant="ghost"
                size="medium"
                aria-label={t('NAV_MENU_DIALOG_CLOSE')}
              >
                <MobileMenuCloseIcon />
              </Button>
            </DialogPrimitive.Close>
            <ShoppingCartMenuItem />
          </div>
          {isContentVisible && (
            <NavigationMenuPrimitive.Root className={navigation} defaultValue={defaultValue}>
              <NavigationMenuPrimitive.List className={navigationPrimaryList}>
                <div>{children}</div>
                <div className={buttonWrapper}>
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
                </div>
              </NavigationMenuPrimitive.List>
            </NavigationMenuPrimitive.Root>
          )}
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  )
}

function DialogContent(props: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={dialogOverlay} />
      <DialogPrimitive.Content {...props} />
    </DialogPrimitive.Portal>
  )
}

const MobileMenuOpenIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16C0 10.3995 0 7.59921 1.08993 5.46009C2.04867 3.57847 3.57847 2.04867 5.46009 1.08993C7.59921 0 10.3995 0 16 0H24C29.6005 0 32.4008 0 34.5399 1.08993C36.4215 2.04867 37.9513 3.57847 38.9101 5.46009C40 7.59921 40 10.3995 40 16V24C40 29.6005 40 32.4008 38.9101 34.5399C37.9513 36.4215 36.4215 37.9513 34.5399 38.9101C32.4008 40 29.6005 40 24 40H16C10.3995 40 7.59921 40 5.46009 38.9101C3.57847 37.9513 2.04867 36.4215 1.08993 34.5399C0 32.4008 0 29.6005 0 24V16Z"
        fill={tokens.colors.grayTranslucent200}
      />
      <path
        d="M14 16L26 16"
        stroke={tokens.colors.gray1000}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 24L26 24"
        stroke={tokens.colors.gray1000}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const MobileMenuCloseIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16C0 10.3995 0 7.59921 1.08993 5.46009C2.04867 3.57847 3.57847 2.04867 5.46009 1.08993C7.59921 0 10.3995 0 16 0H24C29.6005 0 32.4008 0 34.5399 1.08993C36.4215 2.04867 37.9513 3.57847 38.9101 5.46009C40 7.59921 40 10.3995 40 16V24C40 29.6005 40 32.4008 38.9101 34.5399C37.9513 36.4215 36.4215 37.9513 34.5399 38.9101C32.4008 40 29.6005 40 24 40H16C10.3995 40 7.59921 40 5.46009 38.9101C3.57847 37.9513 2.04867 36.4215 1.08993 34.5399C0 32.4008 0 29.6005 0 24V16Z"
        fill={tokens.colors.grayTranslucent200}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8735 13.8128C14.5806 13.5199 14.1057 13.5199 13.8128 13.8128C13.5199 14.1057 13.5199 14.5805 13.8128 14.8734L18.9393 19.9999L13.8128 25.1265C13.5199 25.4194 13.52 25.8943 13.8128 26.1871C14.1057 26.48 14.5806 26.48 14.8735 26.1871L20 21.0606L25.1265 26.1871C25.4194 26.48 25.8943 26.48 26.1872 26.1871C26.4801 25.8942 26.4801 25.4194 26.1872 25.1265L21.0606 19.9999L26.1871 14.8733C26.48 14.5804 26.48 14.1056 26.1871 13.8127C25.8942 13.5198 25.4193 13.5198 25.1265 13.8127L20 18.9393L14.8735 13.8128Z"
        fill={tokens.colors.gray1000}
      />
    </svg>
  )
}
