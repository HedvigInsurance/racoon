import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Text, Space, Button, Heading, AppleIcon, AndroidIcon, theme } from 'ui'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

type Props = {
  onClickPhoneLink?: () => void
}

export const Content = (props: Props) => {
  const { t } = useTranslation('contact-us')
  const { routingLocale } = useCurrentLocale()

  const handleClickPhoneLink = () => {
    datadogRum.addAction('Contact us | phone')
    props.onClickPhoneLink?.()
  }

  const handleClickFaqLink = () => {
    datadogRum.addAction('Contact us | faq')
  }

  const handleClickIosButton = () => {
    datadogRum.addAction('Contact us | IOS App')
  }

  const handleClickAndroidButton = () => {
    datadogRum.addAction('Contact us | Android App')
  }

  return (
    <Wrapper y={2}>
      <Text as="p" align="center" balance={true}>
        {t('ALREADY_MEMBER_SUB_HEADING')}
      </Text>

      <AppButtons>
        <Button
          href={getAppStoreLink('apple', routingLocale).toString()}
          target="_blank"
          variant="secondary"
          size="small"
          onClick={handleClickIosButton}
          Icon={<AppleIcon size="18px" />}
        >
          App Store
        </Button>

        <Button
          href={getAppStoreLink('google', routingLocale).toString()}
          target="_blank"
          variant="secondary"
          size="small"
          onClick={handleClickAndroidButton}
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
              href={PageLink.faq({ locale: routingLocale }).pathname}
              target="_blank"
              onClick={handleClickFaqLink}
            >
              <span>{t('FAQ_OPTION_LABEL')}</span>
              <span>{t('FAQ_OPTION_VALUE')}</span>
            </LinkButton>

            <LinkButton href="#" aria-disabled="true">
              <span>{t('CHAT_OPTION_LABEL')}</span>
              <span>{t('CHAT_UNAVAILABLE_LABEL')}</span>
            </LinkButton>

            <LinkButton
              href={PageLink.help({ locale: routingLocale }).pathname}
              onClick={handleClickPhoneLink}
            >
              <span>{t('TELEPHONE_OPTION_LABEL')}</span>
              <span>{t('TELEPHONE_OPTION_VALUE')}</span>
            </LinkButton>
          </Space>
        </Space>
      </Paper>
    </Wrapper>
  )
}

const Paper = styled.div({
  padding: theme.space.md,
  borderRadius: theme.radius.xs,
  boxShadow: theme.shadow.default,
  backgroundColor: theme.colors.offWhite,
})

const Wrapper = styled(Space)({
  padding: theme.space.md,
  overflowY: 'auto',
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
    color: theme.colors.textDisabled,
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
