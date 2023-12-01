import { type GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { type ComponentProps } from 'react'
import { PaymentPage } from '@/features/widget/PaymentPage'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = ComponentProps<typeof PaymentPage>

type Params = {
  flow: string
  shopSessionId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const apolloClient = await initializeApolloServerSide({
    req: context.req,
    res: context.res,
    locale: context.locale,
  })

  const [translations, trustlyUrl] = await Promise.all([
    serverSideTranslations(context.locale),
    createTrustlyUrl({ apolloClient, locale: context.locale }),
  ])

  return {
    props: { ...translations, trustlyUrl, ...context.params },
  }
}

const NextPage = (props: Props) => {
  const { t } = useTranslation('widget')

  return (
    <>
      <Head>
        <title>{`Hedvig | ${t('PAYMENT_TRUSTLY_TITLE')}`}</title>
      </Head>
      <PaymentPage {...props} />
    </>
  )
}

export default NextPage
