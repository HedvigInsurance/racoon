import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { forwardRef, ReactNode } from 'react'

type SpaceFlexProps = {
  children?: ReactNode
  className?: string
  space?: number
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
}

const SpaceFlexWrapper = styled('div', { shouldForwardProp: isPropValid })(
  ({ space, direction, align, wrap }: SpaceFlexProps) => ({
    display: 'flex',
    flexWrap: wrap,
    gap: `${space}rem`,
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    alignItems: align,
  }),
)

export const SpaceFlex = forwardRef<HTMLDivElement, SpaceFlexProps>(
  ({ children, className, space = 1, direction = 'horizontal', align = 'start', wrap }, ref) => (
    <SpaceFlexWrapper
      ref={ref}
      className={className}
      space={space}
      direction={direction}
      align={align}
      wrap={wrap}
    >
      {children}
    </SpaceFlexWrapper>
  ),
)
SpaceFlex.displayName = 'SpaceFlex'
