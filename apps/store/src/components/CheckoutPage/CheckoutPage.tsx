import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowForwardIcon, Button, Heading, HedvigLogo, InputField, Space } from 'ui'
import { PriceBreakdown } from '@/components/PriceBreakdown/PriceBreakdown'
import { PageLink } from '@/utils/PageLink'
import { FormElement } from './CheckoutPage.constants'
import { formatAPIDate } from './CheckoutPage.helpers'
import { CheckoutPageProps } from './CheckoutPage.types'

const DATE_TODAY = formatAPIDate(new Date())

const CheckoutPage = (props: CheckoutPageProps) => {
  const { currency, cost, products, campaigns, loading, prefilledData, userErrors } = props

  return (
    <>
      <Space y={1}>
        <Header>
          <Link href={PageLink.cart()} passHref legacyBehavior>
            <StyledLink>
              <ArrowBackIcon size="1rem" />
            </StyledLink>
          </Link>
          <HedvigLogo width={82} />
        </Header>

        <Main>
          <Space y={2}>
            <Space y={1}>
              <MainTop>
                <Heading as="h1" variant="standard.24">
                  Checkout
                </Heading>
              </MainTop>

              <PriceBreakdown
                currency={currency}
                products={products}
                cost={cost}
                campaigns={campaigns}
              />
            </Space>

            <Section as="section" y={1}>
              <Heading as="h2" variant="standard.24">
                1. Select start dates
              </Heading>

              <Space y={1}>
                {products.map((product) => (
                  <Card key={product.offerId}>
                    <Space y={0.5}>
                      <Heading as="h2" variant="standard.18">
                        {product.name}
                      </Heading>

                      <InputField
                        label="Start date"
                        type="date"
                        errorMessage={product.errorMessage}
                        name={product.offerId}
                        defaultValue={product.startDate ?? DATE_TODAY}
                      />
                    </Space>
                  </Card>
                ))}
              </Space>
            </Section>

            <Section as="section" y={1}>
              <Heading as="h2" variant="standard.24">
                2. Your contact info
              </Heading>

              <InputField
                label="Email"
                name={FormElement.Email}
                type="email"
                required
                defaultValue={prefilledData.email ?? undefined}
                errorMessage={userErrors[FormElement.Email]}
              />
            </Section>

            <Section as="section" y={1}>
              <Heading as="h2" variant="standard.24">
                3. Authorize
              </Heading>

              <Space y={0.5}>
                <Button fullWidth disabled={loading}>
                  Complete purchase
                </Button>
                {userErrors.form && <p>ERROR: {userErrors.form}</p>}
                <p>After completing the purchase, you&apos;ll can connect payment.</p>
              </Space>
            </Section>
          </Space>
        </Main>
      </Space>
    </>
  )
}

const Header = styled.header(({ theme }) => ({
  height: '3.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space[4],
  position: 'relative',
}))

const StyledLink = styled.a(({ theme }) => ({
  position: 'absolute',
  left: theme.space[4],
  top: '50%',
  transform: 'translate(0, -50%)',
}))

const ArrowBackIcon = styled(ArrowForwardIcon)({
  transform: 'rotate(180deg)',
})

const Main = styled.main(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[4],
}))

const MainTop = styled.div({ textAlign: 'center' })

const Section = styled(Space)(({ theme }) => ({
  borderTop: `2px solid ${theme.colors.gray900}`,
  paddingTop: theme.space[4],
}))

const Card = styled.div(({ theme }) => ({
  padding: theme.space[3],
  border: `2px solid ${theme.colors.gray300}`,
  borderRadius: 8,
  backgroundColor: theme.colors.gray300,
}))

export default CheckoutPage
