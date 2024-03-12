import { storyblokEditable } from '@storyblok/react'
import { ComponentProps } from 'react'
import { Spacer } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = {
  size: string
}

type SpacerBlockProps = SbBaseBlockProps<Props>
type SpacerSize = ComponentProps<typeof Spacer>['size']

export const SpacerBlock = ({ blok }: SpacerBlockProps) => {
  return <Spacer size={blok.size as SpacerSize} {...storyblokEditable} />
}

SpacerBlock.blockName = 'spacer'
