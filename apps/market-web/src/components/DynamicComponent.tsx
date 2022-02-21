import type { StoryblokBlock, StoryblokComponentName } from '@/lib/types'

import { HeadlineBlock } from '../blocks/HeadlineBlock/HeadlineBlock'
import { PlainTextBlock } from '../blocks/PlainTextBlock'
import React from 'react'
import SbEditable from 'storyblok-react'
import { SpacerBlock } from '../blocks/SpacerBlock'

type Props = {
  block: StoryblokBlock
}

const Components: Record<StoryblokComponentName, React.FC<any>> = {
  headline_block: HeadlineBlock,
  spacer_block: SpacerBlock,
  plain_text_block: PlainTextBlock,
}

const DynamicComponent = ({ block }: Props) => {
  if (typeof Components[block.component] !== 'undefined') {
    const Component = Components[block.component]
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
