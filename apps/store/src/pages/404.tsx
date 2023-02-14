import { GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FourOhFourPage } from '@/components/FourOhFourPage/FourOhFourPage'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { initializeApollo } from '@/services/apollo/client'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

const NextPage: NextPageWithLayout = () => {
  return <FourOhFourPage />
}

export const getStaticProps: GetStaticProps = async (context) => {
  const rawLocale = context.locale ?? context.defaultLocale
  // TODO: Remove this when we have a global 404 page
  const locale: RoutingLocale = isRoutingLocale(rawLocale) ? rawLocale : 'en-se'

  const apolloClient = initializeApollo({ locale })
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
    },
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu overlayMenu={true}>{children}</LayoutWithMenu>

export default NextPage
