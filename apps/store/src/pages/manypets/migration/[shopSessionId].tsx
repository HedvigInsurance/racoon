import { StoryblokComponent } from '@storyblok/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import {
  ManyPetsMigrationPage,
  type ManyPetsMigrationPageProps,
} from '@/components/ManyPetsMigrationPage/ManyPetsMigrationPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import {
  ManyPetsMigrationOffersDocument,
  ManyPetsMigrationOffersQuery,
  ManyPetsMigrationOffersQueryVariables,
  ProductOffer,
} from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'
import { getComparisonTableData } from '@/services/manypets/manypetsService'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import {
  getStoryBySlug,
  MANYPETS_FOLDER_SLUG,
  ManyPetsMigrationStory,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = {
  [SHOP_SESSION_PROP_NAME]: string
  [STORY_PROP_NAME]: ManyPetsMigrationStory
} & Pick<ManyPetsMigrationPageProps, 'offers' | 'comparisonTableData'>

type Params = { shopSessionId: string }

const NextManyPetsMigrationPage: NextPage<Props> = ({
  [STORY_PROP_NAME]: story,
  offers,
  comparisonTableData,
}) => {
  const { preOfferContent, postOfferContent } = story.content

  return (
    <>
      <HeadSeoInfo story={story} />
      <ManyPetsMigrationPage
        preOfferContent={preOfferContent?.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
        postOfferContent={postOfferContent.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
        offers={offers}
        comparisonTableData={comparisonTableData}
      />
    </>
  )
}

const isPetRelatedOffer = (offer: ProductOffer) =>
  offer.variant.typeOfContract.includes('SE_DOG') || offer.variant.typeOfContract.includes('SE_CAT')

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
    getStoryBySlug<ManyPetsMigrationStory>(`${MANYPETS_FOLDER_SLUG}/migration`, {
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

  if (!pageStory) {
    return { notFound: true }
  }

  const { data, errors } = await apolloClient.query<
    ManyPetsMigrationOffersQuery,
    ManyPetsMigrationOffersQueryVariables
  >({
    query: ManyPetsMigrationOffersDocument,
    variables: {
      shopSessionId: shopSession.id,
    },
  })

  if (errors) {
    return { notFound: true }
  }

  const offers = data.petMigrationOffers as Array<ProductOffer>
  const petRelatedOffers = offers.filter(isPetRelatedOffer)
  // Since it shouldn't be possbile to have pet related offers with different tier levels, like SE_DOG_BASIC and SE_DOG_STANDARD,
  // any pet related offer can be used to determine the tier level and, therefore, get the appropriate comparison table data.
  const baseOffer = petRelatedOffers[0]
  const comparisonTableData = getComparisonTableData(baseOffer)

  return addApolloState(apolloClient, {
    props: {
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      [STORY_PROP_NAME]: pageStory,
      offers: petRelatedOffers,
      comparisonTableData,
      ...translations,
    },
  })
}

export default NextManyPetsMigrationPage
