'use client'

import type { ComponentProps } from 'react'
import { Div, Flex } from '@hedvig-ui/redesign'

type Props = ComponentProps<typeof Div>

export const TableColumn = (props: Props) => {
  return <Flex px="medium" align="center" {...props} />
}
