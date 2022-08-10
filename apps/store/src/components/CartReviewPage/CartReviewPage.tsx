import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowForwardIcon, Button, Heading, InputField, Space } from 'ui'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { PageLink } from '@/lib/PageLink'
import { LINE_PREFIX } from './CartReviewPage.constants'
import { CartReviewPageProps } from './CartReviewPage.types'
import { useResizeObserver } from './useResizeObserver'

const DATE_TODAY = new Date().toISOString().substring(0, 10)

const CartReviewPage = ({ currency, cost, products, campaigns }: CartReviewPageProps) => {
  const [ref, { height: footerHeight }] = useResizeObserver()

  return (
    <>
      <Space y={1}>
        <Header>
          <nav>
            <Link href={PageLink.cart()}>
              <SpaceFlex align="center" space={0.5}>
                <ArrowBackIcon size="1rem" />
                <div>Return to cart</div>
              </SpaceFlex>
            </Link>
          </nav>
        </Header>

        <Main footerHeight={footerHeight}>
          <Space y={1.5}>
            <MainTop>
              <Heading as="h1" variant="standard.24">
                Start date
              </Heading>
            </MainTop>

            <Space y={1}>
              {products.map((product) => (
                <Card key={product.lineId}>
                  <Space y={0.5}>
                    <Heading as="h2" variant="standard.18">
                      {product.name}
                    </Heading>

                    <InputField
                      label="Start date"
                      type="date"
                      name={[LINE_PREFIX, product.lineId].join('')}
                      defaultValue={product.startDate ?? DATE_TODAY}
                    />
                  </Space>
                </Card>
              ))}
            </Space>
          </Space>
        </Main>
      </Space>

      <Footer ref={ref}>
        <Space y={1}>
          <PriceBreakdown
            currency={currency}
            products={products}
            cost={cost}
            campaigns={campaigns}
          />
          <Button fullWidth>Continue to contact details</Button>
        </Space>
      </Footer>
    </>
  )
}

const Header = styled.header(({ theme }) => ({
  height: '3.75rem',
  display: 'flex',
  alignItems: 'center',
  padding: theme.space[4],
  lineHeight: '3.75rem',
}))

const ArrowBackIcon = styled(ArrowForwardIcon)({
  transform: 'rotate(180deg)',
})

type MainProps = { footerHeight: number }

const Main = styled.main<MainProps>(({ theme, footerHeight }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: `calc(${footerHeight}px + ${theme.space[4]})`,
}))

const MainTop = styled.div({
  textAlign: 'center',
})

const Card = styled.div(({ theme }) => ({
  padding: theme.space[3],
  border: `2px solid ${theme.colors.gray300}`,
  borderRadius: 8,
  backgroundColor: theme.colors.white,
}))

const Footer = styled.footer(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  padding: theme.space[4],
  paddingBottom: theme.space[6],
  backgroundColor: theme.colors.white,
}))

export default CartReviewPage
