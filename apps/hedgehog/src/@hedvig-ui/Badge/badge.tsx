import styled from '@emotion/styled'
import { Theme } from '@emotion/react'

export type BadgeSize = 'small' | 'medium' | 'large'
export type BadgeVariant = 'danger' | 'warning' | 'success' | 'default'

export interface BadgeProps {
  size?: BadgeSize
  fluid?: boolean
  centered?: boolean
  bold?: boolean
  variant?: BadgeVariant
  matchParentSize?: boolean
}

const getPaddingFromSize = (size?: BadgeSize, matchParentSize?: boolean) => {
  const unit = matchParentSize ? 'em' : 'rem'
  switch (size) {
    case 'small':
      return `0.5${unit} 0.5${unit}`
    case 'medium':
      return `0.7${unit} 0.7${unit}`
    case 'large':
      return `0.9${unit} 0.9${unit}`
    default:
      return `0.5${unit} 0.5${unit}`
  }
}

const getColorFromVariant = (theme: Theme, variant?: BadgeVariant) => {
  switch (variant) {
    case 'danger':
      return theme.danger
    case 'warning':
      return theme.warning
    case 'success':
      return theme.success
    default:
      return theme.accent
  }
}

export const Badge = styled.div<BadgeProps>`
  display: inline-block;
  padding: ${({ size, matchParentSize }) =>
    getPaddingFromSize(size, matchParentSize)};
  line-height: 1;
  background: ${({ theme, variant }) => getColorFromVariant(theme, variant)};
  border-radius: 13px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: ${({ bold = false }) => (bold ? 'bold' : 'normal')};
  width: ${({ fluid = false }) => (fluid ? '100%' : 'auto')};
  text-align: ${({ centered = true }) => (centered ? 'center' : 'left')};
  font-size: ${({ matchParentSize }) => matchParentSize && '0.7em'};
`
