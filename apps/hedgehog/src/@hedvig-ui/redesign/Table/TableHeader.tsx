'use client'

import * as React from 'react'
import styled from '@emotion/styled'
import { TableRow } from '@hedvig-ui/redesign/Table'

type Props = React.ComponentProps<typeof TableRow>

export const TableHeader = (props: Props) => {
  return <StyledTableHeader {...props} />
}

const StyledTableHeader = styled(TableRow)`
  font-size: 14px;
  height: 44px;

  &:hover {
    background-color: initial;
  }
`
