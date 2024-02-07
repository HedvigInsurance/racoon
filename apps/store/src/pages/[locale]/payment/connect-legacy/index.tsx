import { type GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { availablePaymentMethods } from '@/services/adyen/availablePaymentMethods'
import { useAdyenTranslations } from '@/services/adyen/useAdyenTranslations'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken } from '@/services/authApi/persist'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

// Adyen component doesn't support SSR, so we only render client-side
const DynamicAdyenCheckout = dynamic(() => import('@/services/adyen/AdyenCheckout'), { ssr: false })

type Props = {
  paymentMethodsResponse: Awaited<ReturnType<typeof availablePaymentMethods>>
}

const PaymentConnectLegacyPage = (props: Props) => {
  const { title } = useAdyenTranslations()

  return (
    <Layout title={title}>
      <DynamicAdyenCheckout {...props} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  // We don't have a way to authenticate in NO/DK
  const accessToken = getAccessToken({ req: context.req, res: context.res })
  if (!accessToken) {
    console.info('Payment Connect Legacy | No access token')
    return {
      redirect: {
        destination: PageLink.paymentConnectLegacyError({ locale: context.locale }).pathname,
        statusCode: 307,
      },
    }
  }

  const apolloClient = await initializeApolloServerSide({
    req: context.req,
    res: context.res,
    locale: context.locale,
  })

  return {
    props: {
      paymentMethodsResponse: await availablePaymentMethods(apolloClient),
    },
  }
}

export default PaymentConnectLegacyPage
