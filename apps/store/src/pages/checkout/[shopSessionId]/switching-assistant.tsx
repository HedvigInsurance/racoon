import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import {
  SwitchingAssistantPage,
  SwitchingAssistantPageProps,
} from '@/components/SwitchingAssistantPage/SwitchingAssistantPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Params = { shopSessionId: string }

type NextPageProps = SwitchingAssistantPageProps & {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextSwitchingAssistantPage: NextPage<NextPageProps> = (props) => {
  return <SwitchingAssistantPage {...props} />
}

export const getServerSideProps: GetServerSideProps<NextPageProps, Params> = async (context) => {
  const { req, res, locale, params } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  const fallbackRedirect = {
    redirect: { destination: PageLink.confirmation({ locale, shopSessionId }), permanent: false },
  } as const

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession
  try {
    shopSession = await setupShopSessionServiceServerSide({ apolloClient, req, res }).fetchById(
      shopSessionId,
    )
    // TODO: validate ShopSession
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return fallbackRedirect
  }

  const entries: SwitchingAssistantPageProps['entries'] = []
  shopSession.cart.entries.forEach((item) => {
    if (item.cancellation.option === ExternalInsuranceCancellationOption.Banksignering) {
      const company = item.cancellation.externalInsurer?.displayName
      if (!company) {
        console.warn('Missing company name for Banksignering cancellation', {
          entryId: item.id,
        })
        return
      }

      if (!item.cancellation.bankSigneringApproveByDate) {
        console.error('Missing Banksignering approve by date', { entryId: item.id })
        return
      }

      entries.push({
        offerId: item.id,
        name: item.variant.product.displayNameFull,
        company,
        date: item.cancellation.bankSigneringApproveByDate,
      })
    }
  })

  if (entries.length === 0) {
    console.error('No Banksignering entries found', { shopSessionId })
    return fallbackRedirect
  }

  const [checkoutSteps, translations] = await Promise.all([
    fetchCheckoutSteps({ apolloClient, shopSession }),
    serverSideTranslations(locale),
  ])

  const pageProps = {
    ...translations,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
    entries,
    checkoutSteps,
  } satisfies NextPageProps

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextSwitchingAssistantPage
