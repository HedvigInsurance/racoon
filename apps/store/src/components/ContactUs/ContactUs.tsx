'use client'

import * as Popover from '@radix-ui/react-popover'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import {
  AndroidIcon,
  AppleIcon,
  Button,
  Heading,
  HedvigSymbol,
  MinusIcon,
  Text,
  yStack,
  xStack,
} from 'ui'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import {
  chatWindow,
  contactUsButton,
  statusIcon,
  header,
  closeButton,
  content,
} from './ContactUs.css'

export const ContactUs = () => {
  const variant = useResponsiveVariant('lg')
  const { t } = useTranslation('contact-us')
  const locale = useRoutingLocale()
  const [open, setOpen] = useState(false)

  if (variant !== 'desktop') return null

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild={true}>
        <Button
          className={contactUsButton}
          Icon={<span className={statusIcon} />}
          variant="secondary"
          size="medium"
        >
          {t('CONTACT_US_BUTTON_LABEL')}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={8} asChild={true}>
          <div className={chatWindow}>
            <header className={header}>
              <HedvigSymbol size="24px" />
              <Text as="span">Hedvig</Text>
              <Popover.Close className={closeButton}>
                <MinusIcon size="18px" />
              </Popover.Close>
            </header>

            <div className={content}>
              <div className={yStack({ gap: 'md' })}>
                <div>
                  <Text as="p" align="center" balance={true}>
                    {t('ALREADY_MEMBER_HEADING')}
                  </Text>
                  <Text as="p" align="center" balance={true}>
                    {t('ALREADY_MEMBER_SUB_HEADING')}
                  </Text>
                </div>

                <div
                  className={xStack({ alignItems: 'center', justifyContent: 'center', gap: 'md' })}
                >
                  <Button
                    as="a"
                    data-dd-action-name="Contact us | IOS App"
                    href={getAppStoreLink('apple', locale).toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="small"
                    Icon={<AppleIcon size="18px" />}
                  >
                    App Store
                  </Button>

                  <Button
                    as="a"
                    data-dd-action-name="Contact us | Android App"
                    href={getAppStoreLink('google', locale).toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="small"
                    Icon={<AndroidIcon size="18px" />}
                  >
                    Google Play
                  </Button>
                </div>
              </div>

              <div className={yStack({ gap: 'md' })}>
                <Heading as="h1" variant="standard.18" align="center">
                  {t('CHAT_HEADING')}
                </Heading>
                <div className={yStack({ alignItems: 'center', gap: 'xs' })}>
                  <Button
                    as="a"
                    data-dd-action-name="Contact us | faq"
                    href={PageLink.faq({ locale }).pathname}
                    target="_blank"
                    variant="secondary"
                  >
                    <span>{t('FAQ_OPTION')}</span>
                  </Button>

                  <Button
                    as="a"
                    data-dd-action-name="Contact us | phone"
                    href={PageLink.help({ locale }).pathname}
                    target="_blank"
                    variant="secondary"
                  >
                    <span>{t('TELEPHONE_OPTION')}</span>
                  </Button>
                  <Button
                    as="a"
                    data-dd-action-name="Contact us | email"
                    href={PageLink.emailUs({ locale }).pathname}
                    target="_blank"
                    variant="secondary"
                  >
                    <span>{t('EMAIL_OPTION')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
