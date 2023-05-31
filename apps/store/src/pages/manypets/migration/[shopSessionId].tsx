import { ApolloClient } from '@apollo/client'
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
  Money,
  ProductOffer,
  ShopSessionDocument,
  ShopSessionQuery,
  ShopSessionQueryVariables,
} from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'
import { getComparisonTableData } from '@/services/manypets/manypetsService'
import {
  getStoryBySlug,
  MANYPETS_FOLDER_SLUG,
  ManyPetsMigrationStory,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = {
  [STORY_PROP_NAME]: ManyPetsMigrationStory
} & Pick<
  ManyPetsMigrationPageProps,
  'migrationSessionId' | 'offers' | 'totalCost' | 'latestAdoptionDate' | 'comparisonTableData'
>

type Params = { shopSessionId: string }

const NextManyPetsMigrationPage: NextPage<Props> = ({
  migrationSessionId,
  [STORY_PROP_NAME]: story,
  offers,
  totalCost,
  latestAdoptionDate,
  comparisonTableData,
}) => {
  const { preOfferContent, postOfferContent } = story.content

  return (
    <>
      <HeadSeoInfo story={story} />
      <ManyPetsMigrationPage
        migrationSessionId={migrationSessionId}
        preOfferContent={preOfferContent?.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
        offers={offers}
        totalCost={totalCost}
        latestAdoptionDate={latestAdoptionDate}
        comparisonTableData={comparisonTableData}
        postOfferContent={postOfferContent.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      />
    </>
  )
}

const isPetRelatedOffer = (offer: ProductOffer) =>
  offer.variant.typeOfContract.includes('SE_DOG') || offer.variant.typeOfContract.includes('SE_CAT')

const sortByStartDate = (offerA: ProductOffer, offerB: ProductOffer) =>
  Date.parse(offerA.startDate) - Date.parse(offerB.startDate)

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

  const [shopSession, pageStory, translations] = await Promise.all([
    fetchMigrationSession(apolloClient, shopSessionId).catch((err) => {
      console.error('Failed to find shopSession', err)
    }),
    getStoryBySlug<ManyPetsMigrationStory>(`${MANYPETS_FOLDER_SLUG}/migration`, {
      locale,
      // Uncomment for local debug
      // version: 'draft',
    }),
    serverSideTranslations(locale),
  ])

  if (!shopSession) {
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
    variables: { shopSessionId },
  })

  if (errors) {
    return { notFound: true }
  }

  // It should be possible to get any other offers that are not pet related offers here, but we're
  // filtering them just to be safe.
  const offers = (data.petMigrationOffers as Array<ProductOffer>).filter(isPetRelatedOffer)
  // Since it shouldn't be possible to have offers with different tier levels, like SE_DOG_BASIC and SE_DOG_STANDARD,
  // any offer can be used to determine the tier level and therefore get the appropriate comparison table data.
  const baseOffer = offers[0]
  const totalCost: Money = {
    amount: offers.reduce((sum, offer) => sum + offer.price.amount, 0),
    currencyCode: baseOffer.price.currencyCode,
  }
  const offersWithStartDate = offers.filter((offer) => offer.startDate !== undefined)
  const latestAdoptionDate = offersWithStartDate.sort(sortByStartDate)[0].startDate
  const comparisonTableData = getComparisonTableData(baseOffer)

  return addApolloState(apolloClient, {
    props: {
      migrationSessionId: shopSession.id,
      [STORY_PROP_NAME]: pageStory,
      offers,
      totalCost,
      latestAdoptionDate,
      comparisonTableData,
      ...translations,
    },
  })
}

const fetchMigrationSession = async (apolloClient: ApolloClient<any>, shopSessionId: string) => {
  const { data } = await apolloClient.query<ShopSessionQuery, ShopSessionQueryVariables>({
    query: ShopSessionDocument,
    variables: { shopSessionId },
  })
  return data.shopSession
}

export default NextManyPetsMigrationPage
