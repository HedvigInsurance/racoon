import { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ErrorPage } from '@/components/ErrorPage/ErrorPage'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { initializeApollo } from '@/services/apollo/client'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

const NextPage: NextPageWithLayout = () => {
  const { t } = useTranslation()

  return (
    <ErrorPage>
      <SpaceFlex direction="vertical" align="center" space={1.5}>
        <Heading as="h1" variant={{ _: 'standard.24', lg: 'standard.32' }}>
          {t('404_PAGE_MESSAGE')}
        </Heading>

        <ButtonNextLink
          variant="primary"
          size={{ base: 'small', lg: 'medium' }}
          href={PageLink.home()}
        >
          {t('404_PAGE_BUTTON')}
        </ButtonNextLink>
      </SpaceFlex>
    </ErrorPage>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const rawLocale = context.locale ?? context.defaultLocale
  // TODO: Remove this when we have a global 404 page
  const locale: RoutingLocale = isRoutingLocale(rawLocale) ? rawLocale : 'se-en'

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
