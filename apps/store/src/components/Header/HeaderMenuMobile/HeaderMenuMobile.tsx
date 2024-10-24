import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { startTransition, useEffect, useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { AndroidIcon } from 'ui/src/icons/AndroidIcon'
import { AppleIcon } from 'ui/src/icons/AppleIcon'
import { visuallyHidden } from 'ui'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { HamburgerCloseIcon, HamburgerOpenIcon } from '../HamburgerIcon/HamburgerIcon'
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
          variant="secondary"
          size="medium"
          aria-label={t('NAV_MENU_DIALOG_OPEN')}
          Icon={<HamburgerOpenIcon />}
        />
      </DialogPrimitive.Trigger>
      <DialogContent>
        <DialogPrimitive.Title className={visuallyHidden}>
          {t('NAV_MENU_DIALOG_OPEN')}
        </DialogPrimitive.Title>
        <div className={contentWrapper}>
          <div className={HeaderMenuHeader}>
            <div className={logoWrapper}>
              <LogoHomeLink />
            </div>
            <DialogPrimitive.Close asChild={true}>
              <Button
                className={buttonTrigger}
                variant="secondary"
                size="medium"
                aria-label={t('NAV_MENU_DIALOG_CLOSE')}
                Icon={<HamburgerCloseIcon />}
              />
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
      <DialogPrimitive.Content {...props} aria-describedby={undefined} />
    </DialogPrimitive.Portal>
  )
}
