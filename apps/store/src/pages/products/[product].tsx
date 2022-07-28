import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { setupPriceCalculator } from '@/components/PriceCalculator/PriceCalculator.helpers'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
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
  const { marketLabel: countryCode } = getLocale(context.locale ?? context.defaultLocale)
  const slug = context.params?.product

  if (typeof slug !== 'string') return { notFound: true }
  if (!isCountryCode(countryCode)) return { notFound: true }

  try {
    const story = await getProductStory(slug, context.preview)
    const { template, priceIntent } = await setupPriceCalculator({
      countryCode,
      productId: story.content.productId,
      request: context.req,
      response: context.res,
    })

    return {
      props: { story, priceFormTemplate: template, priceIntent },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
