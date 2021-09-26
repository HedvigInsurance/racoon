import type { StoryblokBlock, StoryblokComponentName } from "@/lib/types";

import React from "react";
import SbEditable from "storyblok-react";
import ColumnTextBlock from "./blocks/column-text-block";
import HeroBlock from "./blocks/hero-block";
import SpacerBlock from "./blocks/spacer-block";

interface Props {
  block: StoryblokBlock
}

const Components: Record<StoryblokComponentName, React.FC<any>> = {
  hero_block: HeroBlock,
  spacer_block: SpacerBlock,
  column_text_block: ColumnTextBlock
}

const DynamicComponent: React.FC<Props> = ({ block }) => {
  if (typeof Components[block.component] !== 'undefined') {
    const Component = Components[block.component]
    return (
      <SbEditable content={block}>
        <Component block={block}/>
      </SbEditable>
    )
  }

  return (
    <p>The component <strong>{block.component}</strong> has not been created yet.</p>
  )
}

export default DynamicComponent;
