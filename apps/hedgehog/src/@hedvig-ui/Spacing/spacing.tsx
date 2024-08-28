import styled from '@emotion/styled'

export type SpacingSize =
  | 'fraction'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
export type SpacingDirection = 'top' | 'right' | 'bottom' | 'left' | 'all'
export type SpacingWidth = 'full' | 'auto'

export interface SpacingProps
  extends Partial<Record<SpacingDirection, boolean | SpacingSize>> {
  width?: SpacingWidth
  inline?: boolean
}

export const spacingMap: Record<SpacingSize, string> = {
  fraction: '0.25rem',
  tiny: '0.5rem',
  small: '1rem',
  medium: '2rem',
  large: '3rem',
  huge: '6rem',
}

export const Spacing = styled('div')<SpacingProps>`
  ${({ inline }) => inline && 'display: inline-flex;'};
  align-items: center;
  width: ${({ width }) => (width === 'auto' ? 'auto' : '100%')};
  padding-top: ${({ top, all }) => {
    if (!top && !all) {
      return 0
    }
    return spacingMap[
      top === true || all === true ? 'medium' : (top as SpacingSize)
    ]
  }};
  padding-right: ${({ right, all }) => {
    if (!right && !all) {
      return 0
    }
    return spacingMap[
      right === true || all === true ? 'medium' : (right as SpacingSize)
    ]
  }};
  padding-bottom: ${({ bottom, all }) => {
    if (!bottom && !all) {
      return 0
    }
    return spacingMap[
      bottom === true || all === true ? 'medium' : (bottom as SpacingSize)
    ]
  }};
  padding-left: ${({ left, all }) => {
    if (!left && !all) {
      return 0
    }
    return spacingMap[
      left === true || all === true ? 'medium' : (left as SpacingSize)
    ]
  }};
`
