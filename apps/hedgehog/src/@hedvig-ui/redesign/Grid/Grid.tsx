import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Div, SPACING, SpacingSize } from '@hedvig-ui/redesign'

type GridCommonProps = {
  gap?: SpacingSize
  columnGap?: SpacingSize
  rowGap?: SpacingSize
}

type TemplateColumns = {
  templateColumns?: string
  equalColumns?: never
}
type EqualColumns = {
  equalColumns?: number
  templateColumns?: never
}
type TemplateRows = {
  templateRows?: string
  equalRows?: never
}
type EqualRows = {
  equalRows?: number
  templateRows?: never
}

type GridProps = GridCommonProps &
  (TemplateColumns | EqualColumns) &
  (TemplateRows | EqualRows)

export const getGridEqualColumnsStyle = (equalColumns: number) =>
  `repeat(${equalColumns}, minmax(0, 1fr))`

export const Grid = styled(Div)<GridProps>(
  ({
    templateColumns,
    equalColumns,
    templateRows,
    equalRows,
    gap,
    columnGap,
    rowGap,
  }) => css`
    width: 100%;
    display: grid;

    ${templateColumns &&
    css`
      grid-template-columns: ${templateColumns};
    `}

    ${equalColumns &&
    css`
      grid-template-columns: ${getGridEqualColumnsStyle(equalColumns)};
    `}

    ${templateRows &&
    css`
      grid-template-rows: ${templateRows};
    `}

    ${equalRows &&
    css`
      grid-template-rows: ${`repeat(${equalRows}, minmax(0, 1fr))`};
    `}

    column-gap: ${columnGap
      ? SPACING[columnGap]
      : gap
        ? SPACING[gap]
        : 'initial'};
    row-gap: ${rowGap ? SPACING[rowGap] : gap ? SPACING[gap] : 'initial'};
  `,
)
