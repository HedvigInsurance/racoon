import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'
import { createPartnerShopSession } from '@/features/widget/createPartnerShopSession'
import {
  fetchFlowMetadata,
  redirectIfRunningInStoryblokEditor,
  updateCustomerDataIfPresent,
} from '@/features/widget/StartFlow.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken, resetAuthTokens } from '@/services/authApi/persist'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { ORIGIN_URL } from '@/utils/url'

type Params = { slug: Array<string> }

export const getServerSideProps: GetServerSideProps<any, Params> = async (context) => {
  patchNextI18nContext(context)
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const url = new URL(context.resolvedUrl, ORIGIN_URL)
  const redirect = redirectIfRunningInStoryblokEditor(url)
  if (redirect) return { redirect }

  const flowMetadata = await fetchFlowMetadata({
    locale: context.locale,
    slug: context.params.slug.join('/'),
    draftMode: context.draftMode,
  })
  if (!flowMetadata) return { notFound: true }

  console.info(`Widget | Starting flow ${flowMetadata.flow} (${flowMetadata.partnerName})`)

  resetAuthTokensIfPresent(context)

  const apolloClient = await initializeApolloServerSide({ ...context, locale: context.locale })

  if (url.searchParams.has('shopSessionId') && url.searchParams.has('priceIntentId')) {
    // Special case, redirect to prefilled price calculator
    // Used in SEB leads flow
    return {
      redirect: {
        destination: PageLink.widgetCalculatePrice({
          locale: context.locale,
          flow: flowMetadata.flow,
          shopSessionId: url.searchParams.get('shopSessionId') as string,
          priceIntentId: url.searchParams.get('priceIntentId') as string,
        }).href,
        permanent: false,
      },
    }
  }

  const [shopSessionId, searchParams] = await createPartnerShopSession({
    apolloClient,
    countryCode: getCountryByLocale(context.locale).countryCode,
    searchParams: url.searchParams,
    ...flowMetadata,
  })

  console.info(`Widget | Created Shop Session: ${shopSessionId}`)

  const unusedSearchParams = await updateCustomerDataIfPresent({
    apolloClient,
    shopSessionId,
    searchParams,
  })

  return createRedirect({
    locale: context.locale,
    flow: flowMetadata.flow,
    shopSessionId,
    searchParams: unusedSearchParams,
  })
}

const resetAuthTokensIfPresent = (context: GetServerSidePropsContext) => {
  if (getAccessToken(context)) {
    console.info(`Widget | Discarding auth token from previous session`)
    resetAuthTokens(context)
  }
}

type CreateRedirectParams = {
  locale: RoutingLocale
  flow: string
  shopSessionId: string
  searchParams: URLSearchParams
}

const createRedirect = (params: CreateRedirectParams) => {
  const nextUrl = PageLink.widgetSelectProduct({
    locale: params.locale,
    flow: params.flow,
    shopSessionId: params.shopSessionId,
  })
  nextUrl.search = params.searchParams.toString()

  return {
    redirect: {
      destination: nextUrl.href,
      permanent: false,
    },
  }
}

const Page = () => null
export default Page
