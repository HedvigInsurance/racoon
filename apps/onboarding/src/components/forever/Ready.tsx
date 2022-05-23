import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { LinkButton, Space } from 'ui'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'

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

const Paragrapgh = styled.p(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.gray700,
}))

export const Ready: NextPage = () => {
  const { t } = useTranslation()
  const { path } = useCurrentLocale()

  return (
    <Wrapper y={1}>
      <Paragrapgh>{t('FOREVER_INTRO_READY_QUESTION')}</Paragrapgh>
      <LinkButton href={PageLink.old_landing_page({ locale: path })}>
        {t('FOREVER_INTRO_READY_CTA')}
      </LinkButton>
    </Wrapper>
  )
}
