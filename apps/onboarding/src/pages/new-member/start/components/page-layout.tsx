import { HedvigLogo, mq } from 'ui'

import styled from '@emotion/styled'

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
  height: '100vh',
}))

const Header = styled.header<{ variant: HeaderVariant }>(({ theme, variant }) => ({
  position: 'absolute',
  display: 'flex',
  width: '100%',
  padding: '1rem',
  color: variant === 'light' ? theme.colors.gray100 : theme.colors.gray900,
  zIndex: '1000',

  [mq.lg]: {
    padding: '1.5rem 2rem',
  },
}))

const SiteLink = styled.a<{ variant: HeaderVariant }>(({ theme, variant }) => ({
  color: 'inherit',

  '&:hover': {
    color: variant === 'light' ? theme.colors.gray300 : theme.colors.gray700,
  },
}))

const Main = styled.main({
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
})

type HeaderVariant = 'light' | 'dark'

type PageLayoutProps = {
  children: React.ReactNode
  headerVariant?: HeaderVariant
}

export const PageLayout = ({ children, headerVariant = 'dark' }: PageLayoutProps) => {
  return (
    <Container>
      <Header variant={headerVariant}>
        <SiteLink variant={headerVariant} href="/">
          <HedvigLogo />
        </SiteLink>
      </Header>
      <Main as="main">{children}</Main>
    </Container>
  )
}
