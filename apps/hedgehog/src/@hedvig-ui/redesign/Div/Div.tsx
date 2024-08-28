import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from '../theme'

export const SPACING = {
  ...theme.space,
  ...{
    fraction: theme.space.xxxs,
    tiny: theme.space.xs,
    small: theme.space.sm,
    medium: theme.space.md,
    large: theme.space.lg,
    huge: theme.space.xxl,
  },
} as const

export type SpacingSize = keyof typeof SPACING

const getSpacingByPrio = (
  prio1?: SpacingSize,
  prio2?: SpacingSize,
  prio3?: SpacingSize,
) => {
  const spacing = prio1 ?? prio2 ?? prio3
  return spacing ? SPACING[spacing] : 0
}

const getPadding = (padding: PaddingProps) => {
  const { p, py, px, pt, pr, pb, pl } = padding
  const paddingTop = getSpacingByPrio(pt, py, p)
  const paddingRight = getSpacingByPrio(pr, px, p)
  const paddingBottom = getSpacingByPrio(pb, py, p)
  const paddingLeft = getSpacingByPrio(pl, px, p)

  return `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
}

const getMargin = (margin: MarginProps) => {
  const { m, my, mx, mt, mr, mb, ml } = margin
  const marginTop = getSpacingByPrio(mt, my, m)
  const marginRight = getSpacingByPrio(mr, mx, m)
  const marginBottom = getSpacingByPrio(mb, my, m)
  const marginLeft = getSpacingByPrio(ml, mx, m)

  return `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`
}

type PaddingProps = {
  p?: SpacingSize
  py?: SpacingSize
  px?: SpacingSize
  pt?: SpacingSize
  pr?: SpacingSize
  pb?: SpacingSize
  pl?: SpacingSize
}

type MarginProps = {
  m?: SpacingSize
  my?: SpacingSize
  mx?: SpacingSize
  mt?: SpacingSize
  mr?: SpacingSize
  mb?: SpacingSize
  ml?: SpacingSize
}

type DivProps = {
  templateColumns?: string
  equalColumns?: number
  templateRows?: string
  equalRows?: number
  gap?: SpacingSize
  columnGap?: SpacingSize
  rowGap?: SpacingSize
} & PaddingProps &
  MarginProps

export const Div = styled.div<DivProps>(
  (props) => css`
    padding: ${getPadding(props)};
    margin: ${getMargin(props)};
  `,
)
