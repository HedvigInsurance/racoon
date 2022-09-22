import styled from '@emotion/styled'
import { forwardRef, ReactNode } from 'react'

type SpaceFlexProps = {
  children?: ReactNode
  space?: number
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end'
  wrap?: boolean
}

const SpaceFlexWrapper = styled.div(({ space, direction, align, wrap }: SpaceFlexProps) => ({
  display: 'flex',
  flexWrap: wrap ? 'wrap' : 'initial',
  gap: `${space}rem`,
  flexDirection: direction === 'horizontal' ? 'row' : 'column',
  alignItems: align,
}))

export const SpaceFlex = forwardRef<HTMLDivElement, SpaceFlexProps>(
  ({ children, space = 1, direction = 'horizontal', align = 'start', wrap = false }, ref) => (
    <SpaceFlexWrapper ref={ref} space={space} direction={direction} align={align} wrap={wrap}>
      {children}
    </SpaceFlexWrapper>
  ),
)
SpaceFlex.displayName = 'SpaceFlex'
