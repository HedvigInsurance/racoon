import { StoryblokComponent } from '@storyblok/react'
import { CurrencyCode } from '@/services/graphql/generated'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { ManyPetsMigrationStory } from './manyPets.types'
import { ManyPetsMigrationPage } from './ManyPetsMigrationPage/ManyPetsMigrationPage'

type Props = SbBaseBlockProps<ManyPetsMigrationStory['content']>

// Storyblok Content Type
export const ManyPetsMigrationPageBlock = ({ blok }: Props) => {
  return (
    <ManyPetsMigrationPage
      migrationSessionId={'empty-placeholder'}
      announcement={blok.announcement?.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
      // We can't preview this on storyblok since there will be no migration shopping session
      // available. Therefore, we just pass empty values for the dynamic section of the page:
      // Offer and ComparisonTable
      preOfferContent={blok.preOfferContent?.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
      offers={[]}
      totalCost={{ amount: 0, currencyCode: CurrencyCode.Sek }}
      comparisonTableData={[]}
      postOfferContent={blok.postOfferContent.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
    />
  )
}

ManyPetsMigrationPageBlock.blockName = 'ManypetsMigrationPage'
