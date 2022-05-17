import styled from '@emotion/styled'
import { mq } from 'ui'

export type SelectableCardWrapperProps = {
  selected?: boolean
  enableHover?: boolean
  required?: boolean
  isCheckable?: boolean
  onCheck?: () => void
}

export type ClickableCardWrapperProps = {
  href?: string
}

export type BaseCardProps = {
  cardImg: string
  title: string
  description: string
  imgAlt?: string
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

const Wrapper = styled.div({
  transition: 'all 150ms',
  display: 'flex',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
})

export const SelectableCardWrapper = styled(Wrapper)<SelectableCardWrapperProps>(
  ({ theme, isCheckable, selected, enableHover }) => ({
    cursor: isCheckable ? 'pointer' : 'initial',
    border: selected ? `1px solid ${theme.colors.black}` : `1px solid ${theme.colors.gray300}`,
    ':hover': (enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
  }),
)

export const ClickableCardWrapper = styled(Wrapper)<ClickableCardWrapperProps>(({ theme }) => ({
  cursor: 'pointer',
  border: `1px solid ${theme.colors.gray300}`,
  ':hover': { transform: 'translateY(-6px)', color: `${theme.colors.gray900} ` },
}))
