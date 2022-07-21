import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { setupPriceCalculator } from '@/components/PriceCalculator/PriceCalculator.helpers'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getLocale } from '@/lib/l10n/getLocale'
import { CurrencyCode } from '@/services/apollo/generated'
import { CmsService } from '@/services/cms/CmsService'
import { getProductByMarketAndName } from '@/services/mockProductService'

const NextProductPage: NextPageWithLayout<ProductPageProps> = (props: ProductPageProps) => {
  return <ProductPage {...props} />
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const localeData = getLocale(context.locale ?? context.defaultLocale)
  const slugParam = context.params?.product

  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  if (!slug) return { notFound: true }

  const cmsProduct = await CmsService.getProductByMarketAndSlug(localeData.marketLabel, slug)

  if (!cmsProduct) return { notFound: true }

  const product = getProductByMarketAndName(cmsProduct.market, cmsProduct.product)

  if (!product) return { notFound: true }

  try {
    const { template, priceIntent } = await setupPriceCalculator({
      productId: cmsProduct.productId,
      request: context.req,
      response: context.res,
    })

    const lineItem = priceIntent.lines?.[0]

    return {
      props: {
        cmsProduct,
        product: {
          ...product,
          price: lineItem?.price.amount ?? null,
          currencyCode: CurrencyCode.Sek,
          gradient: ['#00BFFF', '#00ff00'],
        },
        priceFormTemplate: template,
      },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
