import styled from '@emotion/styled'
import Head from 'next/head'
import { mq, theme } from 'ui'
import { Header } from './Header'
import { Menu } from './Menu'

type Props = { children: React.ReactNode }

export const LayoutWithMenu = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <Header />
      <Main>
        <Menu />
        <Content>{children}</Content>
      </Main>
    </>
  )
}

const Main = styled.main({
  display: 'grid',
  gridTemplateRows: '60px 1fr',
  maxWidth: '80rem',
  width: '100%',
  marginInline: 'auto',
  paddingBottom: theme.space.xxl,

  [mq.lg]: {
    paddingTop: theme.space.md,
    gridTemplateColumns: '18rem 1fr',
    gridTemplateRows: 'auto',
  },
})

const Content = styled.div({
  paddingInline: theme.space.md,
})
