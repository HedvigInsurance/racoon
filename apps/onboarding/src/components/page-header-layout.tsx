import styled from '@emotion/styled'
import { HedvigLogo, mq, theme } from 'ui'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.gray100,
  height: '100vh',
})

const Header = styled.header<{ variant: HeaderVariant }>(({ variant }) => ({
  position: 'absolute',
  display: 'flex',
  width: '100%',
  padding: '1rem',
  color: variant === 'light' ? theme.colors.gray100 : theme.colors.gray900,
  zIndex: '1000',

  [mq.md]: {
    position: 'fixed',
    padding: '1.5rem 2rem',
  },
}))

const SiteLink = styled.a<{ variant: HeaderVariant }>(({ variant }) => ({
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

type Props = {
  children: React.ReactNode
  headerVariant?: HeaderVariant
}

export const PageHeaderLayout = ({ children, headerVariant = 'dark' }: Props) => {
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
