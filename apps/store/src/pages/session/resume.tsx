import { type GetStaticProps } from 'next'
import Head from 'next/head'
import { type ComponentProps } from 'react'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { RetargetingPage } from '@/features/retargeting/RetargetingPage'
import { useRedirectUser } from '@/features/retargeting/useRedirectUser'
import { validateUrl } from '@/features/retargeting/validateUrl'
import { initializeApollo } from '@/services/apollo/client'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

if (typeof window !== 'undefined') {
  validateUrl()
}

type Props = ComponentProps<typeof RetargetingPage>

const Page = (props: Props) => {
  useRedirectUser()

  return (
    <>
      <Head>
        <title>Hedvig</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <RetargetingPage {...props} />
    </>
  )
}

export default Page

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const apolloClient = initializeApollo({ locale: context.locale })
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })
  const pillows = productMetadata.map((item) => item.pillowImage).slice(0, 6)

  return { props: { pillows } }
}
