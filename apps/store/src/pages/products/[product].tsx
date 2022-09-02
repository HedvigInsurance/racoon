import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { setupPriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm.helpers'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory, getProductStory } from '@/services/storyblok/storyblok'

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
  const { locale, req, res, params: { product: slug } = {}, preview } = context

  if (!locale || locale === 'default') return { notFound: true }
  if (typeof slug !== 'string') return { notFound: true }

  const { countryCode } = getLocale(context.locale)

  try {
    const apolloClient = initializeApollo()

    const [shopSession, story, globalStory] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getProductStory(slug, { locale, preview }),
      getGlobalStory({ locale, preview }),
    ])

    const { template, priceIntent } = await setupPriceCalculatorForm({
      shopSession,
      apolloClient,
      productName: story.content.productId,
      templateId: story.content.priceFormTemplateId,
      request: req,
      response: res,
    })

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        story,
        globalStory,
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
