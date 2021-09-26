import type { SBSpacerBlock } from "@/lib/types";

import React from "react";

interface Props {
  block: SBSpacerBlock
}

const SpacerBlock: React.FC<Props> = ({ block }) => (
  <div style={{ height: block.size === 'md' ? 100 : 50 }} />
)

export default SpacerBlock;
