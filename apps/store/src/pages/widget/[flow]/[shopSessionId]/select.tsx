import { stringify } from 'querystring'
import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { fetchFlowProducts } from '@/features/widget/fetchFlowProducts'
import { SelectProductPage } from '@/features/widget/SelectProductPage'
import { createPriceIntent } from '@/features/widget/widget.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
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
  const [translations, products] = await Promise.all([
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

  if (products.length === 1) {
    const priceIntent = await createPriceIntent({
      service: priceIntentServiceInitServerSide({ ...context, apolloClient }),
      shopSessionId: context.params.shopSessionId,
      productName: products[0].name,
    })

    const nextUrl = PageLink.widgetCalculatePrice({
      locale: context.locale,
      flow: context.params.flow,
      shopSessionId: context.params.shopSessionId,
      priceIntentId: priceIntent.id,
    })
    nextUrl.search = stringify(context.query)

    return { redirect: { destination: nextUrl.href, permanent: false } }
  }

  return {
    props: { ...translations, products, ...context.params },
  }
}

export default SelectProductPage
