import type { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { ForeverPage, type Props as ForeverPageProps } from '@/components/ForeverPage/ForeverPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { ORIGIN_URL } from '@/utils/url'

type Params = { code: string }
type Props = ForeverPageProps & { canonicalUrl: string }

const NextPage: NextPageWithLayout<Props> = (props) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <meta name="canonical" content={props.canonicalUrl} />
      </Head>
      <ForeverPage {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  if (!context.params?.code) return { notFound: true }
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  try {
    const layoutWithMenuProps = await getLayoutWithMenuProps(context)

    return {
      props: {
        ...layoutWithMenuProps,
        code: context.params.code,
        canonicalUrl: getCanonicalUrl(context.locale).toString(),
      },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

const getCanonicalUrl = (locale: RoutingLocale): URL => {
  switch (locale) {
    case 'se-en':
      return new URL('/se-en/hedvig/discount', ORIGIN_URL)
    default:
      return new URL('/se/hedvig/rabatt', ORIGIN_URL)
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu hideFooter={true}>{children}</LayoutWithMenu>

export default NextPage
