import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Space, theme } from 'ui'
import { LinkButton } from '@/components/Button/Button'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import { PageLayout } from './PageLayout'

const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  to: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
})

const Wrapper = styled(Space)({
  animation: `${fadeInUp} 0.7s cubic-bezier(0.39, 0.575, 0.565, 1)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Paragraph = styled.p({
  textAlign: 'center',
  color: theme.colors.gray700,
})

export const ForeverCodeReadyPage = () => {
  const { t } = useTranslation()
  const { path } = useCurrentLocale()

  return (
    <PageLayout>
      <Wrapper y={1}>
        <Paragraph>{t('FOREVER_INTRO_READY_QUESTION')}</Paragraph>
        <LinkButton href={PageLink.old_landing_page({ locale: path })}>
          {t('FOREVER_INTRO_READY_CTA')}
        </LinkButton>
      </Wrapper>
    </PageLayout>
  )
}
