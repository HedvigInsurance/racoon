import Head from 'next/head'
import { Loader } from './components/loader'
import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'
import styled from '@emotion/styled'
import { theme } from 'ui'

const Heading = styled.h1({
  marginBottom: 0,
  maxWidth: '13ch',
  fontSize: 'clamp(1.5rem, 5vw, 3rem)',
  fontFamily: theme.fonts.heading,
  color: theme.colors.gray900,
  letterSpacing: '-0.02em',
  lineHeight: 1.25
})

const Wrapper = styled.div({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
  justifyContent: 'center',
})

const LoadingContent = styled.div({
  margin: '-20vh auto 0'
})

const LoadingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hedvig | Loading</title>
        <meta property="og:title" content="Hedvig" />
      </Head>
      <PageLayout>
        <Wrapper>
          <LoadingContent>
            <Heading>Vi sätter ihop din försäkring</Heading>
            <Loader />
          </LoadingContent>
        </Wrapper>
      </PageLayout>
    </>
  )
}

export default LoadingPage
