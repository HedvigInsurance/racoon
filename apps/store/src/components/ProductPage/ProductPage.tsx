import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useContext } from 'react'
import { Heading, HeadingOLD, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PriceCard } from '@/components/PriceCard/PriceCard'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { CartList } from '../CartList/CartList'
import { useHandleSubmitPriceCalculator } from '../PriceCalculator/useHandleSubmitPriceCalculator'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({ cmsProduct, product, priceFormTemplate }: ProductPageProps) => {
  const cartContext = useContext(CartContext)
  const { handleSubmit } = useHandleSubmitPriceCalculator({ productId: cmsProduct.productId })

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
      <Heading as="h1" variant="standard.40">
        {cmsProduct.displayName}
      </Heading>
      <Space y={2}>
        {productsOfThisType.length > 0 && (
          <div>
            <Heading as="h2" variant="standard.24">
              Products of this type in cart
            </Heading>
            <CartList filterByProductName={product.name} />
          </div>
        )}

        {product?.insurances.length > 1 && (
          <div>
            <Heading as="h2" variant="standard.24">
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

        <form onSubmit={handleSubmit}>
          <PriceCalculator template={priceFormTemplate} />
        </form>

        <SectionWithPadding>
          <PriceCard
            name={product.displayName}
            cost={product.price ?? undefined}
            currency={product.currencyCode}
            gradient={product.gradient}
            onClick={() => {}}
          />
        </SectionWithPadding>

        <Tabs defaultValue="overview" orientation="horizontal">
          <TabsList aria-label="tabs example">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Heading as="h2" variant="standard.24">
              Coverage Section Heading
            </Heading>
          </TabsContent>
          <TabsContent value="coverage">
            <Heading as="h2" variant="standard.24">
              Perils
            </Heading>
            {product.insurances.map((insurance) => (
              <Fragment key={insurance.name}>
                <Heading as="h3" variant="standard.20">
                  {insurance?.displayName}
                </Heading>
                <ul>
                  {insurance?.perils.map((peril) => (
                    <li key={peril.title} style={{ maxWidth: '400px' }}>
                      <HeadingOLD variant="overline" headingLevel="h3" colorVariant="dark">
                        {peril.title}
                      </HeadingOLD>
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

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
