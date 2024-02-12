import { type GetStaticProps } from 'next'
import Head from 'next/head'
import { type ComponentProps } from 'react'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { RetargetingPage } from '@/features/retargeting/RetargetingPage'
import { useApiRedirectEffect } from '@/features/retargeting/useApiRedirectEffect'
import { initializeApollo } from '@/services/apollo/client'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { staticPathsPerSwedenLocale } from '@/utils/staticPaths'

type Props = ComponentProps<typeof RetargetingPage>

const Page = (props: Props) => {
  useApiRedirectEffect()

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
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const apolloClient = initializeApollo({ locale: context.locale })
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })
  const pillows = productMetadata.map((item) => item.pillowImage).slice(0, 6)

  return { props: { pillows } }
}

export const getStaticPaths = staticPathsPerSwedenLocale
