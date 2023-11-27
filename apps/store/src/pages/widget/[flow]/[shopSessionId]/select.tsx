import { stringify } from 'querystring'
import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client'
import { Redirect, type GetServerSideProps, type GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { fetchFlowProducts } from '@/features/widget/fetchFlowProducts'
import { parseProductNameSearchParams } from '@/features/widget/parseSearchParams'
import { SelectProductPage } from '@/features/widget/SelectProductPage'
import { createPriceIntent, getPriceTemplate } from '@/features/widget/widget.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

type Props = ComponentProps<typeof SelectProductPage>

type Params = {
  flow: string
  shopSessionId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const apolloClient = await initializeApolloServerSide({ ...context, locale: context.locale })
  const [translations, [story, products]] = await Promise.all([
    serverSideTranslations(context.locale),
    fetchFlowProducts({
      apolloClient,
      locale: context.locale,
      flow: context.params.flow,
      draft: context.draftMode,
    }),
  ])

  if (products.length === 0) {
    throw new Error(`No products found for flow ${context.params.flow}`)
  }

  const searchParams = new URLSearchParams(stringify(context.query))
  const compareInsurance = story.content.compareInsurance ?? false

  if (products.length === 1) {
    const productName = products[0].name
    console.info(`Widget | Single product flow: ${productName}`)

    return {
      redirect: await redirectToProduct({
        context,
        apolloClient,
        productName,
        shopSessionId: context.params.shopSessionId,
        locale: context.locale,
        flow: context.params.flow,
        searchParams,
        priceTemplate: getPriceTemplate(productName, compareInsurance),
      }),
    }
  }

  const [preSelectedProductName, updatedSearchParams] = parseProductNameSearchParams(searchParams)
  if (preSelectedProductName) {
    console.info(`Widget | Pre-selected product: ${preSelectedProductName}`)

    if (products.find((product) => product.name === preSelectedProductName)) {
      return {
        redirect: await redirectToProduct({
          context,
          apolloClient,
          productName: preSelectedProductName,
          shopSessionId: context.params.shopSessionId,
          locale: context.locale,
          flow: context.params.flow,
          searchParams: updatedSearchParams,
          priceTemplate: getPriceTemplate(preSelectedProductName, compareInsurance),
        }),
      }
    } else {
      console.warn(`Widget | Pre-selected product not found: ${preSelectedProductName}`)
    }
  }

  return {
    props: {
      ...translations,
      ...context.params,
      products,
      compareInsurance,
    },
  }
}

export default SelectProductPage

type RedirectToProductParams = {
  context: GetServerSidePropsContext
  apolloClient: ApolloClient<NormalizedCacheObject>
  shopSessionId: string
  productName: string
  locale: RoutingLocale
  flow: string
  searchParams: URLSearchParams
  priceTemplate: Template
}

const redirectToProduct = async (params: RedirectToProductParams): Promise<Redirect> => {
  const [priceIntent, updatedSearchParams] = await createPriceIntent({
    service: priceIntentServiceInitServerSide({
      ...params.context,
      apolloClient: params.apolloClient,
    }),
    shopSessionId: params.shopSessionId,
    productName: params.productName,
    searchParams: params.searchParams,
    priceTemplate: params.priceTemplate,
  })

  const nextUrl = PageLink.widgetCalculatePrice({
    locale: params.locale,
    flow: params.flow,
    shopSessionId: params.shopSessionId,
    priceIntentId: priceIntent.id,
  })
  nextUrl.search = updatedSearchParams.toString()

  return { destination: nextUrl.href, permanent: false }
}
