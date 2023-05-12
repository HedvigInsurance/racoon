import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ManyPetsMigrationPage } from '@/components/ManyPetsMigrationPage/ManyPetsMigrationPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { resetAuthTokens } from '@/services/authApi/persist'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getStoryBySlug, MANYPETS_FOLDER_SLUG, PageStory } from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// TODO: Type story data
type Props = { [SHOP_SESSION_PROP_NAME]: string; [STORY_PROP_NAME]: any }
type Params = { shopSessionId: string }

const NextManyPetsMigrationPage: NextPage<Props> = (props) => {
  return <ManyPetsMigrationPage {...props} />
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context

  if (!Features.enabled('MANYPETS_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return { notFound: true }
  }

  // Make sure we don't identify different member based on accessToken - this breaks signing
  resetAuthTokens({ req, res })

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

  const [shopSession, pageStory, translations] = await Promise.all([
    shopSessionService.fetchById(shopSessionId).catch((err) => {
      console.error('Failed to find shopSession', err)
    }),
    getStoryBySlug<PageStory>(`${MANYPETS_FOLDER_SLUG}/migration`, {
      locale,
      // Uncomment for local debug
      // version: 'draft',
    }),
    serverSideTranslations(locale),
  ])

  if (shopSession) {
    shopSessionService.saveId(shopSessionId)
  } else {
    return { notFound: true }
  }

  return addApolloState(apolloClient, {
    props: {
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      [STORY_PROP_NAME]: pageStory,
      ...translations,
    },
  })
}

export default NextManyPetsMigrationPage
