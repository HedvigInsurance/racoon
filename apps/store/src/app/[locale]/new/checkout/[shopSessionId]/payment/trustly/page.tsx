import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { type RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { CheckoutPaymentTrustlyPage } from './CheckoutPaymentTrustlyPage'
import { QueryParam } from './CheckoutPaymentTrustlyPage.constants'

type Params = { locale: RoutingLocale; shopSessionId: string }

type SearchParams = { [key: string]: string | Array<string> | undefined }

type Props = { params: Params; searchParams: SearchParams }

export default async function Page({ params, searchParams }: Props) {
  if (!params.shopSessionId) {
    console.warn('Checkout Payment | shopSessionId is missing')
    notFound()
  }

  const nextUrl =
    typeof searchParams[QueryParam.NextUrl] === 'string'
      ? searchParams[QueryParam.NextUrl]
      : PageLink.confirmation({ locale: params.locale, shopSessionId: params.shopSessionId })
          .pathname

  const { getApolloClient } = setupApolloClient({ locale: params.locale, cookies: cookies() })
  const trustlyUrl = await createTrustlyUrl({
    locale: params.locale,
    apolloClient: getApolloClient(),
  })

  return (
    <CheckoutPaymentTrustlyPage
      shopSessionId={params.shopSessionId}
      trustlyUrl={trustlyUrl}
      nextUrl={nextUrl}
    />
  )
}

export const dynamic = 'force-dynamic'
