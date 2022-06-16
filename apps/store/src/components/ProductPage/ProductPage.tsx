import styled from '@emotion/styled'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { ArrowForwardIcon, Heading, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { CartList } from '../CartList/CartList'
import { ProductPageProps } from './ProductPage.types'

const Wrapper = styled.main({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ProductPage = ({ cmsProduct, priceForm }: ProductPageProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { addProductToCart, getItemsByProductType } = cartContext

  const handleSubmit = (id: string, price: number) => {
    addProductToCart(id, price, cmsProduct)
  }

  const productsOfThisType = getItemsByProductType(cmsProduct.name)

  return (
    <Wrapper>
      <Head>
        <title>{cmsProduct.pageTitle}</title>
      </Head>
      <Heading variant="l" headingLevel="h1" colorVariant="dark">
        Product Page for {cmsProduct.displayName}
      </Heading>
      <Space y={2}>
        <PriceCalculator form={priceForm} onSubmit={handleSubmit} />
        {productsOfThisType.length > 0 && (
          <div>
            <Heading headingLevel="h2" colorVariant="dark" variant="s">
              Products of this type in cart
            </Heading>
            <CartList filterByProductName={cmsProduct.name} />
          </div>
        )}

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
