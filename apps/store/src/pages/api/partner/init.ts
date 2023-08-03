import { ApolloClient } from '@apollo/client'
import { NextApiHandler } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import {
  CountryCode,
  PartnerWidgetInitDocument,
  PartnerWidgetInitMutation,
  PartnerWidgetInitMutationVariables,
} from '@/services/apollo/generated'
import { isIsoLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const DEFAULT_LOCALE: IsoLocale = 'sv-SE'

enum SearchParam {
  Locale = 'locale',
  PartnerId = 'partnerId',
  ExternalMemberId = 'externalMemberId',
  ProductType = 'productType',
  ExternalRequestId = 'requestId',
}

const handler: NextApiHandler = async (req, res) => {
  if (req.url === undefined) throw new Error(`Missing req.url`)

  const { searchParams } = new URL(req.url, ORIGIN_URL)
  const searchLocale = searchParams.get(SearchParam.Locale)
  const externalMemberId = searchParams.get(SearchParam.ExternalMemberId)
  const externalRequestId = searchParams.get(SearchParam.ExternalRequestId)
  const productType = searchParams.get(SearchParam.ProductType)
  const partnerId = searchParams.get(SearchParam.PartnerId)

  const locale = isIsoLocale(searchLocale) ? searchLocale : DEFAULT_LOCALE
  const routingLocale = toRoutingLocale(locale)

  // TODO: Redirect to some error page
  const fallbackRedirect = `${ORIGIN_URL}${PageLink.home({ locale: routingLocale })}`

  if (!partnerId) {
    console.warn(`Missing partnerId`)
    res.redirect(fallbackRedirect)
    return
  }
  console.info(`Partner Init | Partner ID = ${partnerId}`)

  const apolloClient = await initializeApolloServerSide({ locale: routingLocale, req, res })
  let data: Awaited<ReturnType<typeof initPartnerWidget>>
  try {
    data = await initPartnerWidget(apolloClient, {
      partnerId,
      externalMemberId,
      externalRequestId,
    })
  } catch (error) {
    console.warn(`Failed to initialize partner widget session: ${error}`)
    res.redirect(fallbackRedirect)
    return
  }

  const shopSessionId = data.id
  const partnerName = data.partnerName ?? undefined
  console.info(`Partner Init | Shop Session = ${shopSessionId}, Partner = ${partnerName}`)

  // TODO: prefill price intent

  const pageLink = getProductPageLink(productType)
  res.redirect(
    PageLink.session({
      shopSessionId,
      locale: routingLocale,
      next: pageLink,
    }),
  )
}

export default handler

const initPartnerWidget = async (
  apolloClient: ApolloClient<unknown>,
  variables: Omit<PartnerWidgetInitMutationVariables['input'], 'countryCode'>,
): Promise<PartnerWidgetInitMutation['partnerWidgetInit']> => {
  const response = await apolloClient.mutate<
    PartnerWidgetInitMutation,
    PartnerWidgetInitMutationVariables
  >({
    mutation: PartnerWidgetInitDocument,
    variables: {
      input: {
        countryCode: CountryCode.Se,
        ...variables,
      },
    },
  })

  if (!response.data) {
    const errors = response.errors?.map((error) => error.message).join('\n')
    throw new Error(errors)
  }

  return response.data.partnerWidgetInit
}

// Temporary
const getProductPageLink = (productType: string | null) => {
  switch (productType) {
    case 'SWEDISH_APARTMENT':
      return `/se/forsakringar/hemforsakring/hyresratt`

    case 'SWEDISH_HOUSE':
      return `/se/forsakringar/hemforsakring/villaforsakring`
    case 'SWEDISH_ACCIDENT':
      return `/se/forsakringar/olycksfallsforsakring`

    default:
      return PageLink.store({ locale: 'se' })
  }
}
