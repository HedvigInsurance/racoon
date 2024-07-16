import { notFound, redirect } from 'next/navigation'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { CartEntriesSection } from './CartEntriesSection'
import { layout } from './styles.css'

type Params = { locale: RoutingLocale }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const fallbackRedirectUrl = PageLink.home({ locale: params.locale }).toString()

  const { getApolloClient } = setupApolloClient({ locale: params.locale })
  const shopSessionService = setupShopSession(getApolloClient())
  const shopSession = await shopSessionService.fetch()

  if (!shopSession) {
    console.warn('Checkout | Unable to fetch shop session')
    notFound()
  }

  const customer = shopSession.customer
  if (!customer) {
    console.warn('Checkout | No customer in shop session', shopSession.id)
    return redirect(fallbackRedirectUrl)
  }

  if (!customer.ssn) {
    console.warn('Checkout | No SSN in shop session', shopSession.id)
    return redirect(fallbackRedirectUrl)
  }

  return (
    <main className={layout}>
      <CartEntriesSection shopSessionId={shopSession.id} />
    </main>
  )
}

export const dynamic = 'force-dynamic'
