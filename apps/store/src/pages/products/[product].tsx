import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { setupPriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm.helpers'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getProductStory } from '@/services/storyblok/storyblok'
import { isCountryCode } from '@/utils/isCountryCode'

const NextProductPage: NextPageWithLayout<ProductPageProps> = (props: ProductPageProps) => {
  return (
    <>
      <Head>
        <title>{props.story.content.name}</title>
      </Head>
      <ProductPage {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const { req, res } = context

  const { marketLabel: countryCode } = getLocale(context.locale ?? context.defaultLocale)
  const slug = context.params?.product

  if (typeof slug !== 'string') return { notFound: true }
  if (!isCountryCode(countryCode)) return { notFound: true }

  try {
    const apolloClient = initializeApollo()

    const [shopSession, story] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getProductStory(slug, context.preview),
    ])

    const { template, priceIntent } = await setupPriceCalculatorForm({
      shopSession,
      productId: story.content.productId,
      request: context.req,
      response: context.res,
    })

    return {
      props: {
        story,
        priceFormTemplate: template,
        priceIntent,
        shopSession,
        [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
      },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
