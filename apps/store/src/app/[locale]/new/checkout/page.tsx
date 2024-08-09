import { notFound } from 'next/navigation'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { CheckoutPage } from './CheckoutPage'

type Params = { locale: RoutingLocale }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const { getApolloClient } = setupApolloClient({ locale: params.locale })
  const apolloClient = getApolloClient()
  const shopSessionService = setupShopSession(apolloClient)
  const shopSession = await shopSessionService.fetch()

  if (!shopSession) {
    console.warn('Checkout | Unable to fetch shop session')
    notFound()
  }

  return <CheckoutPage locale={params.locale} shopSessionId={shopSession.id} />
}

export const dynamic = 'force-dynamic'
