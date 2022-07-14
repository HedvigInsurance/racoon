import styled from '@emotion/styled'
import { ReactNode } from 'react'

type SpaceFlexProps = {
  children?: ReactNode
  space?: number
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end'
}

const SpaceFlexWrapper = styled.div(({ space, direction, align }: SpaceFlexProps) => ({
  display: 'flex',
  gap: `${space}rem`,
  flexDirection: direction === 'horizontal' ? 'row' : 'column',
  alignItems: align,
}))

export const SpaceFlex = ({
  children,
  space = 1,
  direction = 'horizontal',
  align = 'start',
}: SpaceFlexProps) => (
  <SpaceFlexWrapper space={space} direction={direction} align={align}>
    {children}
  </SpaceFlexWrapper>
)
