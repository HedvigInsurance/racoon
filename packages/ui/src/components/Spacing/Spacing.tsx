import styled from '@emotion/styled'

export type SpacingProps = {
  direction?: 'vertical' | 'horizontal'
  gapSize?: keyof typeof gapSize
  align?: 'start' | 'end' | 'center' | 'baseline'
}

const gapSize = {
  sm: '0.5rem',
  md: '1rem',
  lg: '3rem',
}

export const Spacing = styled.div<SpacingProps>(
  ({ align = 'start', direction = 'horizontal', gapSize: size = 'md' }) => ({
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: direction == 'horizontal' ? 'row' : 'column',
    gap: gapSize[size],
    alignItems: align,
  }),
)
Spacing.defaultProps = {
  align: 'start',
  direction: 'horizontal',
  gapSize: 'md',
}
