import { StoryblokComponent } from '@storyblok/react'
import { ManyPetsMigrationPage } from '@/components/ManyPetsMigrationPage/ManyPetsMigrationPage'
import { SbBaseBlockProps, ManyPetsMigrationStory } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<ManyPetsMigrationStory['content']>

// Storyblok Content Type
export const ManyPetsMigrationPageBlock = ({ blok }: Props) => {
  return (
    <ManyPetsMigrationPage
      preOfferContent={blok.preOfferContent?.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
      postOfferContent={blok.postOfferContent.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
    />
  )
}

ManyPetsMigrationPageBlock.blockName = 'ManypetsMigrationPage'
