import { CSSObject } from '@emotion/react'
import { mq } from 'ui'
import styled from '@emotion/styled'

export type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  isCheckable?: boolean
}

export type BaseCardProps = {
  cardImg: StaticImageData
  title: string
  description: string
  onCheck?: () => void
  imgAlt?: string
} & WrapperProps

export const CheckboxContainer = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 30,
  padding: '0.625rem',
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
      padding: '1.5rem',
    },
  },
  ({ isCheckable }) => ({
    [mq.sm]: {
      paddingRight: (isCheckable && '0.5em') || 'initial',
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
  ({ theme, isCheckable, selected, enableHover }) => ({
    cursor: isCheckable ? 'pointer' : 'initial',
    border: selected ? `1px solid ${theme.colors.black}` : `1px solid ${theme.colors.gray300}`,
    ':hover': (enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
  }),
)
