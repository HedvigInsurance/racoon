import styled from '@emotion/styled'
import { ReactNode } from 'react'

type SpaceFlexProps = {
  children?: ReactNode
  space?: number
  direction?: 'horizontal' | 'vertical'
}

const SpaceFlexWrapper = styled.div(({ space, direction }: SpaceFlexProps) => ({
  display: 'flex',
  gap: `${space}rem`,
  flexDirection: direction === 'horizontal' ? 'row' : 'column',
}))

export const SpaceFlex = ({ children, space = 1, direction = 'horizontal' }: SpaceFlexProps) => (
  <SpaceFlexWrapper space={space} direction={direction}>
    {children}
  </SpaceFlexWrapper>
)
