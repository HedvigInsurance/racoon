import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Popover from '@radix-ui/react-popover'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import {
  AndroidIcon,
  AppleIcon,
  Button,
  Heading,
  HedvigSymbol,
  MinusIcon,
  Space,
  Text,
  theme,
} from 'ui'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { zIndexes } from '@/utils/zIndex'

const scaleIn = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1)',
  },
})

const scaleOut = keyframes({
  from: {
    opacity: 1,
    transform: 'scale(1)',
  },
  to: {
    opacity: 0,
    transform: 'scale(0)',
  },
})

export const ContactUs = () => {
  const variant = useResponsiveVariant('lg')
  const { t } = useTranslation('contact-us')
  const locale = useRoutingLocale()
  const [open, setOpen] = useState(false)

  if (variant !== 'desktop') return null

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild={true}>
        <ContactUsButton Icon={<Status />} variant="secondary" size="medium">
          {t('CONTACT_US_BUTTON_LABEL')}
        </ContactUsButton>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={8} asChild={true}>
          <ChatWindow>
            <Header>
              <HedvigSymbol size="24px" />
              <Text as="span">Hedvig</Text>
              <CloseButton>
                <MinusIcon size="18px" />
              </CloseButton>
            </Header>

            <Content y={2}>
              <div>
                <Text as="p" align="center" balance={true}>
                  {t('ALREADY_MEMBER_HEADING')}
                </Text>
                <Text as="p" align="center" balance={true}>
                  {t('ALREADY_MEMBER_SUB_HEADING')}
                </Text>
              </div>

              <AppButtons>
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
              </AppButtons>

              <Paper>
                <Space y={1}>
                  <Heading as="h1" variant="standard.18" align="center">
                    {t('CHAT_HEADING')}
                  </Heading>

                  <Space y={0.5}>
                    <LinkButton
                      data-dd-action-name="Contact us | faq"
                      href={PageLink.faq({ locale }).pathname}
                      target="_blank"
                    >
                      <span>{t('FAQ_OPTION_LABEL')}</span>
                      <span>{t('FAQ_OPTION_VALUE')}</span>
                    </LinkButton>

                    <LinkButton
                      data-dd-action-name="Contact us | phone"
                      href={PageLink.help({ locale }).pathname}
                      target="_blank"
                    >
                      <span>{t('TELEPHONE_OPTION_LABEL')}</span>
                      <span>{t('TELEPHONE_OPTION_VALUE')}</span>
                    </LinkButton>
                  </Space>
                </Space>
              </Paper>
            </Content>
          </ChatWindow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const ContactUsButton = styled(Button)({
  position: 'fixed',
  right: theme.space.lg,
  bottom: theme.space.lg,
  width: 'auto',
  zIndex: zIndexes.contactUs,
})

const Status = styled.span({
  flex: '0 0 auto',
  display: 'inline-block',
  width: 14,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: theme.colors.signalBlueElement,
})

const ChatWindow = styled.div({
  display: 'grid',
  gridTemplateRows: '55px 1fr',
  height: 500,
  aspectRatio: '4 / 5',
  backgroundColor: theme.colors.offWhite,
  borderRadius: theme.radius.md,
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  filter: 'drop-shadow(0px 1px 1px hsl(0deg 0% 0% / 0.15))',

  '&[data-state=open]': {
    animation: `${scaleIn} 250ms ${theme.transitions.css.easeInCubic}`,
  },
  '&[data-state=closed]': {
    animation: `${scaleOut} 250ms ${theme.transitions.css.easeOutCubic}`,
  },
})

const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  color: theme.colors.white,
  backgroundColor: theme.colors.black,
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.md,
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
})

const CloseButton = styled(Popover.Close)({
  cursor: 'pointer',
})

const Content = styled(Space)({
  padding: theme.space.md,
  overflowY: 'auto',
})

const Paper = styled.div({
  padding: theme.space.md,
  borderRadius: theme.radius.xs,
  boxShadow: theme.shadow.default,
  backgroundColor: theme.colors.offWhite,
})

const LinkButton = styled(Link)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space.sm,
  fontSize: theme.fontSizes.sm,
  border: `1px solid ${theme.colors.gray200}`,
  borderRadius: theme.radius.sm,
  paddingBlock: theme.space.md,
  paddingInline: theme.space.md,

  '&[aria-disabled=true]': {
    pointerEvents: 'none',
    color: theme.colors.textTertiary,
  },

  '@media(hover: hover)': {
    '&:not([aria-disabled=true]):hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray200,
    },
  },
})

const AppButtons = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
})
