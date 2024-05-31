import type { ApolloClient } from '@apollo/client'
import { StoryblokComponent } from '@storyblok/react'
import type { NextPage } from 'next'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { STORYBLOK_MANYPETS_FOLDER_SLUG } from '@/features/manyPets/manyPets.constants'
import type { ManyPetsMigrationStory } from '@/features/manyPets/manyPets.types'
import {
  ManyPetsMigrationPage,
  type ManyPetsMigrationPageProps,
} from '@/features/manyPets/ManyPetsMigrationPage/ManyPetsMigrationPage'
import { getComparisonTableData } from '@/features/manyPets/manyPetsService'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { resetAuthTokens } from '@/services/authApi/persist'
import type {
  ManyPetsMigrationOffersQuery,
  ManyPetsMigrationOffersQueryVariables,
  Money,
  ProductOfferFragment,
  ShopSessionQuery,
  ShopSessionQueryVariables,
} from '@/services/graphql/generated'
import { ManyPetsMigrationOffersDocument, ShopSessionDocument } from '@/services/graphql/generated'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

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
  const { announcement, preOfferContent, postOfferContent } = story.content

  return (
    <>
      <HeadSeoInfo story={story} />
      <ManyPetsMigrationPage
        migrationSessionId={migrationSessionId}
        announcement={announcement?.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
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

const isPetRelatedOffer = (offer: ProductOfferFragment) =>
  offer.variant.typeOfContract.includes('SE_DOG') || offer.variant.typeOfContract.includes('SE_CAT')

const sortByStartDate = (offerA: ProductOfferFragment, offerB: ProductOfferFragment) =>
  Date.parse(offerA.startDate) - Date.parse(offerB.startDate)

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
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

  const slug = `${STORYBLOK_MANYPETS_FOLDER_SLUG}/migration`
  const apolloClient = await initializeApolloServerSide({ req, res, locale })

  try {
    const [shopSession, migrationOffers, pageStory, translations] = await Promise.all([
      fetchMigrationSession(apolloClient, shopSessionId),
      fetchMigrationOffers(apolloClient, shopSessionId),
      getStoryBySlug<ManyPetsMigrationStory>(slug, {
        locale,
        // Uncomment for local debug
        // version: 'draft',
      }),
      serverSideTranslations(locale),
    ])

    // It should not be possible to get any other offers that are not pet related here, but we're
    // filtering them just to be safe.
    const offers = migrationOffers.filter(isPetRelatedOffer)
    // Since it shouldn't be possible to have offers with different tier levels, like SE_DOG_BASIC and SE_DOG_STANDARD,
    // any offer can be used to determine the tier level and therefore get the appropriate comparison table data.
    const baseOffer = offers[0]
    // We can't use shopSession.cart.cost here because at this point the offers aren't added to the cart yet, so
    // we need to calculate the total price on the FE.
    const totalCost: Money = {
      amount: offers.reduce((sum, offer) => sum + offer.cost.net.amount, 0),
      currencyCode: baseOffer.cost.net.currencyCode,
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
  } catch (error) {
    console.error(`Failed to fetch data for ${slug}`, { cause: error })
    return { notFound: true }
  }
}

const fetchMigrationSession = async (apolloClient: ApolloClient<any>, shopSessionId: string) => {
  const { data, errors } = await apolloClient.query<ShopSessionQuery, ShopSessionQueryVariables>({
    query: ShopSessionDocument,
    variables: { shopSessionId },
  })

  if (errors) {
    throw new Error(`Failed to fetch shop session ${shopSessionId}`, { cause: errors })
  }

  return data.shopSession
}

const fetchMigrationOffers = async (apolloClient: ApolloClient<any>, shopSessionId: string) => {
  const { data, errors } = await apolloClient.query<
    ManyPetsMigrationOffersQuery,
    ManyPetsMigrationOffersQueryVariables
  >({
    query: ManyPetsMigrationOffersDocument,
    variables: { shopSessionId },
  })

  if (errors) {
    throw new Error(`Failed to fetch migration offers for shop session ${shopSessionId}`, {
      cause: errors,
    })
  }

  return data.petMigrationOffers
}

export default NextManyPetsMigrationPage
