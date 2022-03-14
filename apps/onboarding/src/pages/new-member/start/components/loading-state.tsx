import Head from 'next/head'
import type { NextPage } from 'next'
import { PageLayout } from './page-layout'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
  justifyContent: 'center',
})

const LoadingContent = styled.div({
  position: 'relative',
  margin: '0 auto',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '1rem',
})

const Overlay = styled.div(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(${theme.colors.gray100}, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), ${theme.colors.gray100})`,
}))

const fadeInUp = keyframes({
  '35%, 50%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '0%': {
    opacity: 0,
    transform: 'translate3d(0, 400px, 0)',
  },
  '100%': {
    opacity: 0,
    transform: 'translate3d(0, -400px, 0)',
  },
})

const Text = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: '1.5rem',
  lineHeight: 1.5,
  fontFamily: theme.fonts.body,

  opacity: 0,
  animation: `${fadeInUp} 5.5s cubic-bezier(0.39, 0.575, 0.565, 1) infinite`,
}))

const TEXTS = [
  'Building your insurance',
  'Comprehensive coverage',
  'All-risk included',
  '5-star rating on Trustpilot',
  'No paperwork or',
  'phone lines',
  'No interrogations or',
  'shaming',
  'Just insurance,',
  'for how people live today',
]

const LoadingState: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hedvig | Loading</title>
        <meta property="og:title" content="Hedvig" />
      </Head>
      <PageLayout>
        <Wrapper>
          <LoadingContent>
            {TEXTS.map((text, i) => (
              <Text key={i} style={{ animationDelay: `${i * 150}ms` }}>
                {text}
              </Text>
            ))}
            <Overlay />
          </LoadingContent>
        </Wrapper>
      </PageLayout>
    </>
  )
}

export default LoadingState
