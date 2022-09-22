import styled from '@emotion/styled'
import { forwardRef, ReactNode } from 'react'

type SpaceFlexProps = {
  children?: ReactNode
  space?: number
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
}

const SpaceFlexWrapper = styled.div(({ space, direction, align, wrap }: SpaceFlexProps) => ({
  display: 'flex',
  flexWrap: wrap,
  gap: `${space}rem`,
  flexDirection: direction === 'horizontal' ? 'row' : 'column',
  alignItems: align,
}))

export const SpaceFlex = forwardRef<HTMLDivElement, SpaceFlexProps>(
  ({ children, space = 1, direction = 'horizontal', align = 'start', wrap }, ref) => (
    <SpaceFlexWrapper ref={ref} space={space} direction={direction} align={align} wrap={wrap}>
      {children}
    </SpaceFlexWrapper>
  ),
)
SpaceFlex.displayName = 'SpaceFlex'
