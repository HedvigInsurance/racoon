import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ConnectPaymentBlock } from '@/blocks/ConnectPaymentBlock'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { getStoryBySlug, type ConnectPaymentStory } from '@/services/storyblok/storyblok'
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

  // We shouldn't fail the page if the CMS content is missing
  let story: ConnectPaymentStory | null = null
  try {
    story = await fetchConnectPaymentStory(params.locale)
  } catch (error) {
    console.log('Checkout Payment | No CMS content found')
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
    <>
      <CheckoutPaymentTrustlyPage
        shopSessionId={params.shopSessionId}
        trustlyUrl={trustlyUrl}
        nextUrl={nextUrl}
      />

      {story && <ConnectPaymentBlock blok={story.content} />}
    </>
  )
}

const CONNECT_PAYMENT_SLUG = 'connect-payment'
function fetchConnectPaymentStory(locale: RoutingLocale): Promise<ConnectPaymentStory> {
  return getStoryBySlug<ConnectPaymentStory>(CONNECT_PAYMENT_SLUG, { locale })
}

export const dynamic = 'force-dynamic'