import { Children, ComponentProps, ReactElement } from 'react'
import styled from '@emotion/styled'
import { Grid, TableColumn } from '@hedvig-ui/redesign'
import { colors } from '@hedvig-ui/redesign/palette'
import { getGridEqualColumnsStyle } from '../Grid/Grid'

type Props = ComponentProps<typeof Grid>

export const TableRow = (props: Props) => {
  const { children, equalColumns, templateColumns, ...rest } = props

  const columns = Children.toArray(children).filter((child) => {
    const castedChild = child as ReactElement
    return castedChild.type === TableColumn
  }).length

  if (equalColumns || templateColumns) {
    return <StyledTableRow {...props} />
  }

  return (
    <StyledTableRow equalColumns={columns} inheritColumns {...rest}>
      {children}
    </StyledTableRow>
  )
}

const StyledTableRow = styled(Grid)<{ inheritColumns?: boolean }>`
  position: relative;
  padding-left: 8px;
  height: 64px;

  // Get template columns from css variable set on parent table, otherwise use equal columns as before
  ${(props) =>
    props.inheritColumns &&
    `grid-template-columns: var(--template-columns, ${getGridEqualColumnsStyle(props.equalColumns ?? 0)});`}

  &:hover {
    background-color: ${colors.gray50};
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.borderTranslucent1};
  }
`
