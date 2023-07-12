import { ApolloClient } from '@apollo/client'
import { type GetStaticPropsContext, type GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { initializeApollo, initializeApolloServerSide } from '@/services/apollo/client'
import { getGlobalStory } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import {
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
  fetchGlobalProductMetadata,
} from './fetchProductMetadata'

export const getLayoutWithMenuProps = async (
  context: GetServerSidePropsContext | GetStaticPropsContext,
  defaultApolloClient?: ApolloClient<unknown>,
) => {
  if (!isRoutingLocale(context.locale)) {
    console.warn(`Locale ${context.locale} is not supported`)
    return null
  }

  let apolloClient = defaultApolloClient
  if (!apolloClient) {
    if (isGetServerSidePropsContext(context)) {
      apolloClient = await initializeApolloServerSide({
        req: context.req,
        res: context.res,
        locale: context.locale,
      })
    } else {
      apolloClient = initializeApollo({ locale: context.locale })
    }
  }

  const [globalStory, productMetadata, translations] = await Promise.all([
    getGlobalStory({ version: context.draftMode ? 'draft' : 'published', locale: context.locale }),
    fetchGlobalProductMetadata({ apolloClient }),
    serverSideTranslations(context.locale),
  ])

  return {
    [GLOBAL_STORY_PROP_NAME]: globalStory,
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
    ...translations,
  }
}

const isGetServerSidePropsContext = (
  context: GetServerSidePropsContext | GetStaticPropsContext,
): context is GetServerSidePropsContext => {
  return 'req' in context && 'res' in context
}
