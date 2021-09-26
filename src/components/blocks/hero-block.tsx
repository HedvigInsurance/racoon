import type { SBHeroBlock } from "@/lib/types";

import React from "react";

interface Props {
  block: SBHeroBlock
}

const HeroBlock: React.FC<Props> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.headline }} />
)

export default HeroBlock;
