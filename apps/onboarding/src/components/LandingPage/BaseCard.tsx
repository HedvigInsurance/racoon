import styled from '@emotion/styled'
import { mq } from 'ui'

export type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  isCheckable?: boolean
  disabled?: boolean
}

export type BaseCardProps = {
  cardImg: string
  blurDataURL: string
  title: string
  description: string
  onCheck?: () => void
  imgAlt?: string
  required?: boolean
  errorMessage?: string
} & WrapperProps

export const Section = styled.div<{ isCheckable?: boolean }>(
  {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',

    [mq.sm]: {
      padding: '1.5rem',
      alignItems: 'flex-start',
    },
  },
  ({ isCheckable }) => ({
    [mq.sm]: {
      paddingRight: (isCheckable && '0.5rem') || 'initial',
    },
    [mq.md]: { paddingRight: '1.5rem' },
  }),
)

export const Wrapper = styled.button<WrapperProps>(
  ({ theme, isCheckable, selected, enableHover }) => ({
    transition: 'all 150ms',
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    cursor: isCheckable ? 'pointer' : 'initial',
    border: '1px solid',
    borderColor: selected ? theme.colors.black : theme.colors.gray300,
    '&:hover:not([disabled])': {
      border: enableHover ? `1px solid ${theme.colors.gray700}` : '',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  }),
)

Wrapper.defaultProps = { type: 'button' }
