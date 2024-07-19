import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { BonusOffer } from './BonusOffer'
import { CartEntries } from './CartEntries'
import { CheckoutForm } from './CheckoutForm'
import { layout, content } from './styles.css'

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
      <div className={content}>
        <div className={yStack({ gap: 'md' })}>
          <section className={yStack({ gap: 'md' })}>
            <CartEntries shopSessionId={shopSession.id} />
          </section>

          <section className={yStack({ gap: 'xl' })}>
            <Suspense>
              <BonusOffer shopSessionId={shopSession.id} />
            </Suspense>

            <Suspense>
              <BankIdContextProvider>
                <CheckoutForm shopSessionId={shopSession.id} />
                <BankIdDialog />
              </BankIdContextProvider>
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
