'use client'

import styled from '@emotion/styled'
import { colors, Div } from '@hedvig-ui/redesign'

type Props = React.ComponentProps<typeof Div> & { templateColumns?: string }

export const Table = (props: Props) => {
  if (props.templateColumns) {
    return (
      <StyledTableContainer
        style={
          {
            '--template-columns': props.templateColumns,
          } as React.CSSProperties
        }
        {...props}
      />
    )
  }
  return <StyledTableContainer {...props} />
}

const StyledTableContainer = styled(Div)`
  width: 100%;
  border-top: 1px solid ${colors.borderTranslucent1};
`
