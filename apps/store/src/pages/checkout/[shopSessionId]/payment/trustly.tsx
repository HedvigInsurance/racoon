import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import { type Props } from '@/components/CheckoutPaymentTrustlyPage/CheckoutPaymentTrustlyPage'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

export { CheckoutPaymentTrustlyPage as default } from '@/components/CheckoutPaymentTrustlyPage/CheckoutPaymentTrustlyPage'

type Params = { shopSessionId: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  locale,
  req,
  res,
  params = {},
}) => {
  if (!isRoutingLocale(locale)) return { notFound: true }
  if (!params.shopSessionId) return { notFound: true }

  const nextUrl = PageLink.confirmation({ locale, shopSessionId: params.shopSessionId })

  try {
    const apolloClient = await initializeApolloServerSide({ req, res, locale })
    const [translations, trustlyUrl, shopSession] = await Promise.all([
      serverSideTranslations(locale),
      createTrustlyUrl({ apolloClient, locale }),
      setupShopSessionServiceServerSide({ apolloClient, req, res }).fetchById(params.shopSessionId),
    ])

    const checkoutSteps = await fetchCheckoutSteps({ apolloClient, req, res, shopSession })

    return {
      props: {
        ...translations,
        locale,
        trustlyUrl,
        nextUrl,
        shopSessionId: params.shopSessionId,
        checkoutSteps,
      },
    }
  } catch (error) {
    console.error('CheckoutPaymentTrustlyPage | Unable to render', error)
    return { redirect: { destination: nextUrl, permanent: false } }
  }
}
