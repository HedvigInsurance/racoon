import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useContext } from 'react'
import { Heading, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { CartList } from '../CartList/CartList'
import { uuid } from '../PriceCalculator/uuid'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({ cmsProduct, product }: ProductPageProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { addProductToCart, getItemsByName } = cartContext

  const handleSubmit = () => {
    // price and id should come from the calculator after price has been generated
    const price = Math.round(100 + Math.random() * 100)
    const id = uuid()
    addProductToCart(id, price, product)
  }

  const productsOfThisType = getItemsByName(product.name)

  return (
    <>
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
            <CartList filterByProductName={product.name} />
          </div>
        )}

        {product?.insurances.length > 1 && (
          <div>
            <Heading variant="s" headingLevel="h2" colorVariant="dark">
              Insurances included in this bundle
            </Heading>
            <ul>
              {product.insurances.map((insurance) => (
                <li key={insurance?.name} style={{ maxWidth: '400px' }}>
                  <strong>{insurance?.displayName}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Heading variant="s" headingLevel="h2" colorVariant="dark">
          Perils
        </Heading>
        {product.insurances.map((insurance) => (
          <Fragment key={insurance.name}>
            <Heading variant="xs" headingLevel="h3" colorVariant="dark">
              {insurance?.displayName}
            </Heading>
            <ul>
              {insurance?.perils.map((peril) => (
                <li key={peril.title} style={{ maxWidth: '400px' }}>
                  <Heading variant="overline" headingLevel="h3" colorVariant="dark">
                    {peril.title}
                  </Heading>
                  <br />
                  {peril.body}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}

        <div>
          <Link href={PageLink.cart()}>Go to cart</Link>
          <br />
          <Link href={PageLink.store()}>Go to shop</Link>
        </div>
      </Space>
    </>
  )
}
