import styled from '@emotion/styled'
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
}

export type BaseCardProps = {
  cardImg: string
  blurDataURL: string
  title: string
  description: string
  imgAlt?: string
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

const Wrapper = styled.button({
  transition: 'all 150ms',
  display: 'flex',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid',
})

export const SelectableCardWrapper = styled(Wrapper)<SelectableCardWrapperProps>(
  ({ theme, isCheckable, selected, enableHover }) => ({
    transition: 'all 150ms',
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    cursor: isCheckable ? 'pointer' : 'initial',
    borderColor: selected ? theme.colors.black : theme.colors.gray300,
    '&:hover:not([disabled])': {
      border: enableHover ? `1px solid ${theme.colors.gray700}` : '',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  }),
)

export const ClickableCardWrapper = styled(Wrapper)<ClickableCardWrapperProps>(({ theme }) => ({
  cursor: 'pointer',
  borderColor: theme.colors.gray300,
  ':hover': { transform: 'translateY(-6px)', color: `${theme.colors.gray900} ` },
}))
