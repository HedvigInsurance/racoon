import { mq } from 'ui'
import styled from '@emotion/styled'

export type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  direction?: 'row' | 'column'
}

export type BaseCardProps = {
  cardImg: StaticImageData
  title: string
  description: string
  checked?: boolean
  onCheck?: () => void
} & WrapperProps

export const Title = styled.h1(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: '1.125rem',
  fontWeight: 400,
  color: theme.colors.gray900,

  [mq.sm]: {
    fontSize: '1.5rem',
  },
}))

export const Description = styled.p(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: theme.colors.gray700,

  [mq.sm]: {
    fontSize: '1.125rem',
  },
}))

export const CheckboxContainer = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 30,
  padding: 10,
  [mq.sm]: {
    padding: 0,
    position: 'static',
    marginLeft: 'auto',
  },
})
