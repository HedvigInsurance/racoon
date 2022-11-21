import { storyblokEditable } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import * as TierSelector from '../components/CarTierSelector/CarTierSelector'

export type TierSelectorItemBlockProps = SbBaseBlockProps<{
  isSelected: boolean
  recommendedText: string
  body: string
  price: string
  title: string
  handleClick: (id: string) => void
}>

export const TierSelectorItemBlock = ({ blok }: TierSelectorItemBlockProps) => {
  return (
    <>
      <TierSelector.Content>
        <TierSelector.TierItem
          {...storyblokEditable(blok)}
          {...blok}
          body={blok.body}
          price={blok.price}
          title={blok.price}
          value={blok._uid}
        />
      </TierSelector.Content>
    </>
  )
}
TierSelectorItemBlock.blockName = 'tierSelectorItem'
