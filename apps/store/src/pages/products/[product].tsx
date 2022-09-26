import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getCountryByLocale } from '@/lib/l10n/countries'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import { fetchPriceTemplate } from '@/services/PriceForm/PriceForm.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory, getProductStory } from '@/services/storyblok/storyblok'

type NextPageProps = ProductPageProps & {
  shopSessionId: string
}

const NextProductPage: NextPageWithLayout<NextPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.story.content.name}</title>
      </Head>
      <ProductPage {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { locale, req, res, params: { product: slug } = {}, preview } = context

  if (!locale || locale === 'default') return { notFound: true }
  if (typeof slug !== 'string') return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  try {
    const apolloClient = initializeApollo()

    const [shopSession, story, globalStory] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getProductStory(slug, { locale, preview }),
      getGlobalStory({ locale, preview }),
    ])

    const priceIntentService = priceIntentServiceInitServerSide({
      req,
      res,
      shopSession,
      apolloClient,
    })
    const priceIntent = await priceIntentService.fetch(story.content.productId)

    const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)
    if (priceTemplate === undefined) {
      throw new Error(`Unknown price template: ${story.content.priceFormTemplateId}`)
    }

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        story,
        globalStory,
        priceTemplate,
        priceIntent,
        shopSessionId: shopSession.id,
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
