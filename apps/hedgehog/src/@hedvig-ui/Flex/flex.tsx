import styled from '@emotion/styled'
import { SpacingSize } from '@hedvig-ui'

const gapMap: Record<SpacingSize, string> = {
  fraction: '0.25rem',
  tiny: '0.5rem',
  small: '1rem',
  medium: '2rem',
  large: '3rem',
  huge: '6rem',
}

export const Flex = styled.div<{
  direction?: string
  justify?: string
  align?: string
  fullWidth?: boolean
  flex?: string
  gap?: SpacingSize
  wrap?: 'wrap' | 'nowrap' | 'revert' | 'wrap-reverse'
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'flex-start' }) => align};
  flex: ${({ flex = '1' }) => flex};
  width: ${({ fullWidth = true }) => (fullWidth ? '100%' : 'auto')};
  gap: ${({ gap = '0' }) => gapMap[gap as SpacingSize]};
  flex-wrap: ${({ wrap }) => wrap ?? 'nowrap'};
`
