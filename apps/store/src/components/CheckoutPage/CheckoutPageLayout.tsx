import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'

type Props = {
  children: React.ReactNode
  Footer: React.ReactNode
}

export const CheckoutPageLayout = ({ children, Footer }: Props) => {
  return (
    <>
      <Space y={3}>
        <Header>
          <a href={PageLink.cart()}>Return to cart</a>
        </Header>

        <PageHeader>
          <Heading as="h1" variant="standard.32">
            Personal details
          </Heading>
        </PageHeader>

        <Main>{children}</Main>
      </Space>

      <FooterWrapper>{Footer}</FooterWrapper>
    </>
  )
}

const Header = styled.header(({ theme }) => ({
  padding: theme.space[3],
}))

const PageHeader = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))

const Main = styled.main(({ theme }) => ({
  padding: theme.space[3],
}))

const FooterWrapper = styled.footer(({ theme }) => ({
  backgroundColor: theme.colors.white,
  padding: theme.space[3],
  paddingBottom: theme.space[5],
  borderTop: `1px solid ${theme.colors.gray300}`,

  width: '100%',
  position: 'fixed',
  bottom: 0,
}))
