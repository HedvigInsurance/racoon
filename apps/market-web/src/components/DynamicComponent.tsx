import React from 'react'
import SbEditable from 'storyblok-react'
import { AccordionBlock } from '@/blocks/AccordionBlock/AccordionBlock'
import { BannerBlock } from '@/blocks/BannerBlock/BannerBlock'
import { BulletPointBlock } from '@/blocks/BulletPointBlock/BulletPointBlock'
import { ColumnTextBlock } from '@/blocks/ColumnTextBlock/ColumnTextBlock'
import { CtaBlock } from '@/blocks/CtaBlock/CtaBlock'
import { HeadlineBlock } from '@/blocks/HeadlineBlock/HeadlineBlock'
import { HeroBlock } from '@/blocks/HeroBlock/HeroBlock'
import { PlainTextBlock } from '@/blocks/PlainTextBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import type { StoryblokBaseBlock, StoryblokComponentName } from '@/services/storyblok/types'

type Props = {
  block: StoryblokBaseBlock
}

export const BlockComponents: Record<StoryblokComponentName, React.FC<any>> = {
  accordion_block: AccordionBlock,
  banner_block: BannerBlock,
  bullet_point_block: BulletPointBlock,
  column_text_block: ColumnTextBlock,
  cta_block: CtaBlock,
  headline_block: HeadlineBlock,
  spacer_block: SpacerBlock,
  plain_text_block: PlainTextBlock,
  hero: HeroBlock,
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
