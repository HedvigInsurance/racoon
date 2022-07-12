import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Button, Heading, InputField, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'

export const CheckoutPage = () => {
  const router = useRouter()
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(PageLink.checkoutPayment())
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={3}>
        <Header>
          <a href={PageLink.cart()}>Return to cart</a>
        </Header>

        <PageHeader>
          <Heading headingLevel="h1" colorVariant="dark" variant="m">
            Contact details
          </Heading>
        </PageHeader>

        <Main>
          <Space y={1}>
            <InputField label="Personal number" name="personalNumber" required />
            <InputField label="First name" name="firstName" required />
            <InputField label="Last name" name="lastName" required />
            <InputField label="Email" name="email" type="email" required />
          </Space>
        </Main>
      </Space>

      <Footer>
        <Button type="submit" fullWidth>
          Continue to payment
        </Button>
      </Footer>
    </form>
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

const Footer = styled.footer(({ theme }) => ({
  backgroundColor: theme.colors.white,
  padding: theme.space[3],
  paddingBottom: theme.space[5],
  borderTop: `1px solid ${theme.colors.gray300}`,

  width: '100%',
  position: 'fixed',
  bottom: 0,
}))
