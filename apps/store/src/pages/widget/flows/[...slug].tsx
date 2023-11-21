import { type GetServerSidePropsContext, type GetServerSideProps } from 'next'
import {
  createPartnerShopSession,
  fetchFlowMetadata,
  redirectIfRunningInStoryblokEditor,
  updateCustomerDataIfPresent,
} from '@/features/widget/StartFlow.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken, resetAuthTokens } from '@/services/authApi/persist'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

type Params = { slug: Array<string> }

export const getServerSideProps: GetServerSideProps<any, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const url = new URL(context.req.url ?? '', ORIGIN_URL)
  const redirect = redirectIfRunningInStoryblokEditor(url, context.locale)
  if (redirect) return { redirect }

  const flowMetadata = await fetchFlowMetadata({
    locale: context.locale,
    slug: context.params.slug.join('/'),
  })
  if (!flowMetadata) return { notFound: true }

  resetAuthTokensIfPresent(context)

  const apolloClient = await initializeApolloServerSide({ ...context, locale: context.locale })
  const [shopSessionId, searchParams] = await createPartnerShopSession({
    apolloClient,
    countryCode: getCountryByLocale(context.locale).countryCode,
    partnerName: flowMetadata.partnerName,
    searchParams: url.searchParams,
  })

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
