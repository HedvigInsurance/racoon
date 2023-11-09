import { ApolloClient } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ComponentPropsWithoutRef } from 'react'
import { CalculatePricePage } from '@/features/widget/CalculatePricePage'
import { getPriceTemplate, isWidgetProductName } from '@/features/widget/widget.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { addApolloState } from '@/services/apollo/client'
import {
  WidgetPriceIntentDocument,
  WidgetPriceIntentQuery,
  useShopSessionQuery,
  useWidgetPriceIntentQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = ComponentPropsWithoutRef<typeof CalculatePricePage>

type Params = {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const serviceParams = { req: context.req, res: context.res }
  const apolloClient = await initializeApolloServerSide(serviceParams)
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })

  try {
    const [translations, priceIntent] = await Promise.all([
      serverSideTranslations(context.locale),
      fetchWidgetPriceIntent(apolloClient, context.params.priceIntentId),
      shopSessionService.fetchById(context.params.shopSessionId),
    ])

    if (!isWidgetProductName(priceIntent.product.name)) {
      console.warn(`Invalid product name: ${priceIntent.product.name}`)
      return { notFound: true }
    }

    const priceTemplate = getPriceTemplate(priceIntent.product.name)

    return addApolloState(apolloClient, {
      props: { priceIntent, priceTemplate, ...translations, ...context.params },
    })
  } catch (error) {
    console.error('Widget Calculate Price | Unable to render', error)
    return { notFound: true }
  }
}

const Page = (props: Props) => {
  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId: props.shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  const priceIntentResult = useWidgetPriceIntentQuery({
    variables: { priceIntentId: props.priceIntentId },
  })
  const priceIntent = priceIntentResult.data?.priceIntent

  // TODO: Handle loading state
  if (!shopSession || !priceIntent) return null

  return <CalculatePricePage {...props} priceIntent={priceIntent} />
}

export default Page

const fetchWidgetPriceIntent = async (
  apolloClient: ApolloClient<unknown>,
  priceIntentId: string,
) => {
  const { data } = await apolloClient.query<WidgetPriceIntentQuery>({
    query: WidgetPriceIntentDocument,
    variables: {
      priceIntentId,
    },
  })

  return data.priceIntent
}
