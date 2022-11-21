import styled from '@emotion/styled'
import { ImageProps } from 'next/legacy/image'
import { mq } from 'ui'

export type SelectableCardWrapperProps = {
  selected?: boolean
  enableHover?: boolean
  required?: boolean
  isCheckable?: boolean
  disabled?: boolean
  onCheck?: () => void
}

export type ClickableCardWrapperProps = {
  href?: string
  disabled?: boolean
  onClick?: () => void
}

export type BaseCardProps = {
  cardImg: ImageProps
  title: string
  description: string
  errorMessage?: string
}

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

const Wrapper = styled.button(({ theme }) => ({
  transition: 'all 150ms',
  display: 'flex',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.colors.white,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
}))

export const SelectableCardWrapper = styled(Wrapper)<SelectableCardWrapperProps>(
  ({ theme, isCheckable, selected, enableHover }) => ({
    cursor: isCheckable ? 'pointer' : 'initial',
    boxShadow: selected
      ? `0 0 0 1px ${theme.colors.black}, 0px 2px 2px rgba(0, 0, 0, 0.1)`
      : 'initial',
    '&:hover:not([disabled]), &:focus-visible': {
      boxShadow: enableHover
        ? `0 0 0 1px ${theme.colors.gray600}, 0px 2px 2px rgba(0, 0, 0, 0.1)`
        : 'initial',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  }),
)

SelectableCardWrapper.defaultProps = { type: 'button' }

export const ClickableCardWrapper = styled(Wrapper)(({ theme }) => ({
  cursor: 'pointer',

  ':hover': { transform: 'translateY(-6px)', color: `${theme.colors.gray900} ` },
}))
