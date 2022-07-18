import styled from '@emotion/styled'
import { Heading, Space } from 'ui'

type Props = {
  children: React.ReactNode
  Header?: React.ReactNode
}

export const CheckoutPaymentPage = ({ children, Header }: Props) => {
  return (
    <div>
      <Space y={3}>
        <HeaderWrapper>{Header ?? null}</HeaderWrapper>

        <PageHeader>
          <Heading headingLevel="h1" colorVariant="dark" variant="m">
            Payment
          </Heading>
        </PageHeader>

        <Main>{children}</Main>
      </Space>
    </div>
  )
}

const HeaderWrapper = styled.header(({ theme }) => ({
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
