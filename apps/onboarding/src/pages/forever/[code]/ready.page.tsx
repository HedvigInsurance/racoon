import { LinkButton, Separate } from 'ui'

import type { NextPage } from 'next'
import { PageLayout } from '../components/page-layout'
import { PageLink } from '@/lib/page-link'
import { colorsV3 } from '@hedviginsurance/brand'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'

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

const Wrapper = styled(Separate)({
  animation: `${fadeInUp} 0.7s cubic-bezier(0.39, 0.575, 0.565, 1)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Paragrapgh = styled.p({
  textAlign: 'center',
  color: colorsV3.gray700,
})

const ForeverPageReady: NextPage = () => {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Wrapper y={1}>
        <Paragrapgh>{t('FOREVER_INTRO_READY_QUESTION')}</Paragrapgh>
        <LinkButton href={PageLink.landing()}>{t('FOREVER_INTRO_READY_CTA')}</LinkButton>
      </Wrapper>
    </PageLayout>
  )
}

export { getServerSideProps } from '../[code].page'

export default ForeverPageReady
