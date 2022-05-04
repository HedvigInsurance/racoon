import styled from '@emotion/styled'
import { mq } from 'ui'

export type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  isCheckable?: boolean
}

export type BaseCardProps = {
  cardImg: string
  title: string
  description: string
  onCheck?: () => void
  imgAlt?: string
  required?: boolean
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
