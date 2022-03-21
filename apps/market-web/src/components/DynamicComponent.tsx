import React from 'react'
import SbEditable from 'storyblok-react'
import { AccordionBlock } from '@/blocks/AccordionBlock/AccordionBlock'
import type { StoryblokBaseBlock, StoryblokComponentName } from '@/lib/types'
import { HeadlineBlock } from '../blocks/HeadlineBlock/HeadlineBlock'
import { PlainTextBlock } from '../blocks/PlainTextBlock'
import { SpacerBlock } from '../blocks/SpacerBlock'

type Props = {
  block: StoryblokBaseBlock
}

export const BlockComponents: Record<StoryblokComponentName, React.FC<any>> = {
  accordion_block: AccordionBlock,
  banner_block: HeadlineBlock,
  headline_block: HeadlineBlock,
  spacer_block: SpacerBlock,
  plain_text_block: PlainTextBlock,
}

const DynamicComponent = ({ block }: Props) => {
  if (typeof BlockComponents[block.component] !== 'undefined') {
    const Component = BlockComponents[block.component]
    return (
      <SbEditable content={block} key={block._uid}>
        <Component {...block} />
      </SbEditable>
    )
  }

  return (
    <p>
      The component <strong>{block.component}</strong> has not been created yet.
    </p>
  )
}

export default DynamicComponent
