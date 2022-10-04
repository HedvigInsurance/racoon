import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowForwardIcon, Heading, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'

type Props = {
  children: React.ReactNode
  Footer: React.ReactNode
}

export const CheckoutContactDetailsPageLayout = ({ children, Footer }: Props) => {
  return (
    <>
      <Space y={3}>
        <Header>
          <nav>
            <Link href={PageLink.checkout()} passHref>
              <StyledLink>
                <ArrowBackIcon size="1rem" />
                <div>Return to review</div>
              </StyledLink>
            </Link>
          </nav>
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
  padding: theme.space[4],
}))

const StyledLink = styled.a({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
})

const ArrowBackIcon = styled(ArrowForwardIcon)({
  transform: 'rotate(180deg)',
})

const PageHeader = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))

const Main = styled.main(({ theme }) => ({
  padding: theme.space[3],
}))

const FooterWrapper = styled.footer(({ theme }) => ({
  backgroundColor: theme.colors.white,
  padding: theme.space[4],
  paddingBottom: theme.space[6],
  borderTop: `1px solid ${theme.colors.gray300}`,

  width: '100%',
  position: 'fixed',
  bottom: 0,
}))
