import styled from '@emotion/styled'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { ArrowForwardIcon, Heading, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { getProductByMarketAndName } from '@/services/mockProductService'
import { CartList } from '../CartList/CartList'
import { uuid } from '../PriceCalculator/uuid'
import { ProductPageProps } from './ProductPage.types'

const Wrapper = styled.main({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ProductPage = ({ cmsProduct }: ProductPageProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { addProductToCart, getItemsByName } = cartContext

  const handleSubmit = () => {
    // price and id should come from the calculator after price has been generated
    const price = Math.round(100 + Math.random() * 100)
    const id = uuid()
    addProductToCart(id, price, cmsProduct)
  }

  const productsOfThisType = getItemsByName(cmsProduct.name)
  const products = cmsProduct.products.map((p) => getProductByMarketAndName(cmsProduct.market, p))

  return (
    <Wrapper>
      <Head>
        <title>{cmsProduct.pageTitle}</title>
      </Head>
      <Heading variant="l" headingLevel="h1" colorVariant="dark">
        {cmsProduct.displayName}
      </Heading>
      <Space y={2}>
        <PriceCalculator form={cmsProduct.form} onSubmit={handleSubmit} />
        {productsOfThisType.length > 0 && (
          <div>
            <Heading headingLevel="h2" colorVariant="dark" variant="s">
              Products of this type in cart
            </Heading>
            <CartList filterByProductName={cmsProduct.name} />
          </div>
        )}

        {products.length > 1 && (
          <div>
            <Heading variant="s" headingLevel="h2" colorVariant="dark">
              Insurances included in this bundle
            </Heading>
            <ul>
              {products.map((product) => (
                <li key={product?.name} style={{ maxWidth: '400px' }}>
                  <strong>{product?.displayName}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Heading variant="s" headingLevel="h2" colorVariant="dark">
          Perils
        </Heading>
        {cmsProduct.products
          .map((p) => getProductByMarketAndName(cmsProduct.market, p))
          .map((product) => (
            <>
              <Heading variant="xs" headingLevel="h3" colorVariant="dark">
                {product?.displayName}
              </Heading>
              <ul>
                {product?.perils.map((peril) => (
                  <li key={peril.title} style={{ maxWidth: '400px' }}>
                    <Heading variant="overline" headingLevel="h3" colorVariant="dark">
                      {peril.title}
                    </Heading>
                    <br />
                    {peril.body}
                  </li>
                ))}
              </ul>
            </>
          ))}

        <div>
          <Link href={PageLink.cart()} passHref>
            <a>
              Go to cart <ArrowForwardIcon />
            </a>
          </Link>
        </div>
        <div>
          <Link href={PageLink.store()} passHref>
            <a>
              Go to shop <ArrowForwardIcon />
            </a>
          </Link>
        </div>
      </Space>
    </Wrapper>
  )
}
