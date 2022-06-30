import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useContext } from 'react'
import { Button, Heading, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { usePriceCalculator } from '@/components/PriceCalculator/usePriceCalculator'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import type { PriceQuote } from '@/services/mockPriceCalculatorService'
import { CartList } from '../CartList/CartList'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({ cmsProduct, product }: ProductPageProps) => {
  const priceCalculator = usePriceCalculator()
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { addProductToCart, getItemsByName } = cartContext

  const handleSubmit = ({ id, price }: PriceQuote) => {
    addProductToCart(id, price, { ...product, slug: cmsProduct.slug })
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
        {priceCalculator ? (
          <PriceCalculator form={cmsProduct.form} onSubmit={priceCalculator.onSubmit} />
        ) : null}
        {priceCalculator?.quoteForm.priceQuote && (
          <div>
            <h2>SEK {priceCalculator.quoteForm.priceQuote.price}/month</h2>
            <Button onClick={() => handleSubmit(priceCalculator.quoteForm.priceQuote!)}>
              Add to cart
            </Button>
          </div>
        )}
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
