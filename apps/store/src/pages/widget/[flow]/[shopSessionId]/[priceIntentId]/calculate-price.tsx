import { ApolloClient } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ComponentPropsWithoutRef } from 'react'
import { CalculatePricePage } from '@/features/widget/CalculatePricePage'
import { getPriceTemplate } from '@/features/widget/widget.helpers'
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

type Props = Pick<ComponentPropsWithoutRef<typeof CalculatePricePage>, 'flow' | 'priceTemplate'> & {
  priceIntentId: string
  shopSessionId: string
}

type Params = {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const apolloClient = await initializeApolloServerSide({
    req: context.req,
    res: context.res,
    locale: context.locale,
  })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })

  try {
    const [translations, priceIntent] = await Promise.all([
      serverSideTranslations(context.locale),
      fetchWidgetPriceIntent(apolloClient, context.params.priceIntentId),
      shopSessionService.fetchById(context.params.shopSessionId),
    ])

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

  return <CalculatePricePage {...props} shopSession={shopSession} priceIntent={priceIntent} />
}

export default Page

const fetchWidgetPriceIntent = async (
  apolloClient: ApolloClient<unknown>,
  priceIntentId: string,
) => {
  const { data } = await apolloClient.query<WidgetPriceIntentQuery>({
    query: WidgetPriceIntentDocument,
    variables: { priceIntentId },
  })

  return data.priceIntent
}
