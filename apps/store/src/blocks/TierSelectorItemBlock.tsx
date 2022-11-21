import { storyblokEditable } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import * as TierSelector from '../components/TierSelector/TierSelector'

export type TierSelectorItemBlockProps = SbBaseBlockProps<{
  body: string
  handleClick: (id: string) => void
  isSelected: boolean
  price: string
  recommendedText: string
  title: string
}>

export const TierSelectorItemBlock = ({ blok }: TierSelectorItemBlockProps) => {
  return (
    <>
      <TierSelector.Content>
        <TierSelector.TierItem {...storyblokEditable(blok)} {...blok} value={blok._uid} />
      </TierSelector.Content>
    </>
  )
}
TierSelectorItemBlock.blockName = 'tierSelectorItem'
