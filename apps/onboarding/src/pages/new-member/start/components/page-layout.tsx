import { HedvigLogo, mq } from 'ui'

import Head from 'next/head'
import styled from '@emotion/styled'

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
  height: '100vh',
}))

const Header = styled.header({
  display: 'flex',
  width: '100%',
  padding: '1rem',

  [mq.lg]: {
    padding: '1.5rem 2rem',
  },
})

const SiteLink = styled.a(({ theme }) => ({
  color: theme.colors.gray900,

  '&:hover': {
    color: theme.colors.gray700,
  },
}))

const Main = styled.main({
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})


type PageLayoutProps = {
  children: React.ReactNode
}

export const PageLayout = ({ children }: PageLayoutProps) => {

  return (
    <>
      <Head>
        <title>Hedvig</title>
        <meta property="og:title" content="Hedvig" />
      </Head>

      <Container>
        <Header>
          <SiteLink href="/">
            <HedvigLogo />
          </SiteLink>
        </Header>
        <Main as="main">
          {children}
        </Main>
      </Container>
    </>
  )
}
