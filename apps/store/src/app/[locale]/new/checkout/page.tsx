import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

type Params = { locale: RoutingLocale }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const fallbackRedirect = {
    redirect: {
      destination: PageLink.home({ locale: params.locale }).toString(),
      permanent: false,
    },
  } as const

  const apolloClient = getApolloClient({ locale: params.locale })
  const shopSessionService = setupShopSession(apolloClient)
  const shopSession = await shopSessionService.fetch()

  if (!shopSession) {
    console.warn('Checkout | Unable to fetch shop session')
    return fallbackRedirect
  }

  const customer = shopSession.customer
  if (!customer) {
    console.warn('Checkout | No customer in shop session', shopSession.id)
    return fallbackRedirect
  }

  if (!customer.ssn) {
    console.warn('Checkout | No SSN in shop session', shopSession.id)
    return fallbackRedirect
  }

  console.log(shopSession)
  return null
}

// Make sure this route always gets generated using dynamic rendering.
// This provides a simple migration path between SSR pages into it's app router based counterpart.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#options
export const dynamic = 'force-dynamic'
