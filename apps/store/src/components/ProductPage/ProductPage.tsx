import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useContext } from 'react'
import { Heading, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { CartList } from '../CartList/CartList'
import { ProductPageProps } from './ProductPage.types'

const Tabs = styled(RadixTabs.Root)({
  display: 'flex',
  flexDirection: 'column',
})

const TabsList = styled(RadixTabs.TabsList)({
  flexShrink: 0,
  display: 'flex',
  borderBottom: '1px solid #e3e3e3',
})

const TabsTrigger = styled(RadixTabs.Trigger)({
  flex: 1,
  padding: '1rem',
  cursor: 'pointer',
  '&:hover': { color: 'mediumpurple' },
  '&[data-state=active]': {
    color: 'mediumpurple',
    boxShadow: 'inset 0 -1px 0 0 mediumpurple, 0 1px 0 0 currentColor',
  },
  '&:focus-visible': {
    boxShadow: '0 0 0 2px black',
  },
})

const TabsContent = styled(RadixTabs.Content)({})

export const ProductPage = ({ cmsProduct, product }: ProductPageProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { getItemsByName } = cartContext

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

        <Tabs defaultValue="overview" orientation="horizontal">
          <TabsList aria-label="tabs example">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Heading variant="s" headingLevel="h2" colorVariant="dark">
              Coverage Section Heading
            </Heading>
          </TabsContent>
          <TabsContent value="coverage">
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
          </TabsContent>
        </Tabs>

        <div>
          <Link href={PageLink.cart()}>Go to cart</Link>
          <br />
          <Link href={PageLink.store()}>Go to shop</Link>
        </div>
      </Space>
    </>
  )
}
