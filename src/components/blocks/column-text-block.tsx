import type { SBColumnTextBlock } from "@/lib/types";

import React from "react";

interface Props {
  block: SBColumnTextBlock
}

const ColumnTextBlock: React.FC<Props> = ({ block }) => (
  <div>
    <div dangerouslySetInnerHTML={{ __html: block.text_one.html }} />
    <div dangerouslySetInnerHTML={{ __html: block.text_two.html }} />
  </div>
)

export default ColumnTextBlock;
