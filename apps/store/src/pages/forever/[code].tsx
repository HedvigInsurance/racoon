import { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ForeverPage, type Props } from '@/components/ForeverPage/ForeverPage'
import {
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
  fetchGlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Params = { code: string }

const NextPage: NextPageWithLayout<Props> = (props) => <ForeverPage {...props} />

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const code = params?.code
  if (!code) return { notFound: true }

  const apolloClient = await initializeApolloServerSide({ locale, req, res })
  const [globalStory, translations, productMetadata] = await Promise.all([
    getGlobalStory({ locale }),
    serverSideTranslations(locale),
    fetchGlobalProductMetadata({ apolloClient }),
  ])

  return {
    props: {
      ...translations,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
      code,
    },
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu hideFooter={true}>{children}</LayoutWithMenu>

export default NextPage
