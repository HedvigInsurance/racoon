import { type GetServerSideProps } from 'next'
import { Button } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { useAdyenTranslations } from '@/services/adyen/useAdyenTranslations'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = {
  authorizationCode: string
}

const Page = (props: Props) => {
  const locale = useRoutingLocale()
  const { title, startButton } = useAdyenTranslations()

  const nextUrl = PageLink.paymentConnectLegacy({ locale }).pathname
  const authUrl = PageLink.apiAuthExchange({
    authorizationCode: props.authorizationCode,
    next: nextUrl,
  }).href

  return (
    <Layout title={title}>
      <form method="POST" action={authUrl}>
        <Button type="submit" fullWidth={true}>
          {startButton}
        </Button>
      </form>
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await -- required by Next.js
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) {
    throw new Error(`Payment Connect Legacy Start | Invalid locale: ${context.locale}`)
  }

  const { authorizationCode } = context.query

  if (typeof authorizationCode !== 'string') {
    return {
      redirect: {
        destination: PageLink.paymentConnectLegacyError({ locale: context.locale }).pathname,
        permanent: false,
      },
    }
  }

  return { props: { authorizationCode } }
}

export default Page
