import { type GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, type ComponentProps } from 'react'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { QueryParam } from '@/features/retargeting/retargeting.constants'
import { RetargetingPage } from '@/features/retargeting/RetargetingPage'
import { initializeApollo } from '@/services/apollo/client'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

type Props = ComponentProps<typeof RetargetingPage>

const Page = (props: Props) => {
  const router = useRouter()
  const { routingLocale } = useCurrentLocale()
  useEffect(() => {
    const url = new URL(window.location.href)
    const shopSessionId = url.searchParams.get(QueryParam.ShopSession)
    url.searchParams.delete(QueryParam.ShopSession)
    url.pathname = `/api/retargeting/${shopSessionId}`
    url.searchParams.set(QueryParam.Locale, routingLocale)
    router.push(url)
  }, [router, routingLocale])

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
