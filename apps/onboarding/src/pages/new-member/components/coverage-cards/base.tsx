import { CSSObject } from '@emotion/react'
import { mq } from 'ui'
import styled from '@emotion/styled'

export type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  isCheckable?: boolean
  direction?: 'row' | 'column'
  wrapperStyles?: CSSObject
}

export type BaseCardProps = {
  cardImg: StaticImageData
  title: string
  description: string
  checked?: boolean
  onCheck?: () => void
  imgAlt?: string
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

export const Section = styled.div<{ isCheckable?: boolean }>(
  {
    padding: '1em 0.5em',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [mq.sm]: {
      padding: '1.5em',
    },
  },
  ({ theme, ...props }) => ({
    [mq.sm]: {
      paddingRight: (props.isCheckable && '0.5em') || 'initial',
    },
    [mq.md]: { paddingRight: '1.5em' },
  }),
)

export const Wrapper = styled.div<WrapperProps>(
  {
    transition: 'all 150ms',
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  },
  ({ theme, ...props }) => ({
    cursor: props.isCheckable ? 'pointer' : 'initial',
    border: props.selected
      ? `1px solid ${theme.colors.black}`
      : `1px solid ${theme.colors.gray300}`,
    ':hover': (props.enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
    ...props.wrapperStyles,
  }),
)
