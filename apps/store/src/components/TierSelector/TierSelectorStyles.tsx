import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { ChevronIcon, Text, theme } from 'ui'

export const Root = AccordionPrimitives.Root

// TODO: unify accordion animation with the one in the block
const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/accordion
    height: 'var(--radix-accordion-content-height)',
  },
})
const slideUp = keyframes({
  from: {
    height: 'var(--radix-accordion-content-height)',
  },
  to: {
    height: 0,
  },
})

export const Content = styled(AccordionPrimitives.Content)({
  overflow: 'hidden',

  '[data-state=open] &': {
    animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
  '[data-state=closed] &': {
    animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
})

export const Item = styled(AccordionPrimitives.Item)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
})

const Header = AccordionPrimitives.Header

export const ToggleText = styled(Text)({
  '[data-state=open] &': { display: 'none' },
})

const Trigger = styled(AccordionPrimitives.Trigger)({
  height: '3rem',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.radius.xs,
  paddingInline: theme.space.md,
})

const CenteredHeader = styled.div({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.space.md,
})

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
}

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const HeaderWithTrigger = ({
  children,
  icon = <TriggerIcon size="1rem" />,
}: HeaderWithTriggerProps) => {
  return (
    <Header>
      <Trigger>
        <CenteredHeader>{children}</CenteredHeader>
        {icon}
      </Trigger>
    </Header>
  )
}

const RecommendedContainer = styled.div({
  paddingTop: theme.space.xs,
})

const SuggestedDot = styled.span({
  display: 'inline-block',
  height: theme.radius.sm,
  width: theme.radius.sm,
  backgroundColor: theme.colors.black,
  borderRadius: '50%',
  marginRight: theme.space.xs,
})

type SuggestedItemProps = {
  children: React.ReactNode
}

export const SuggestedItem = ({ children }: SuggestedItemProps) => (
  <RecommendedContainer>
    <SuggestedDot />
    {children}
  </RecommendedContainer>
)

export const TierItemWrapper = styled.div<{ isSelected: boolean }>({
  cursor: 'pointer',
  padding: theme.space.xs,

  ':not(:first-of-type)': {
    paddingTop: 0,
  },

  '&:last-of-type': {
    borderRadius: `0 0 ${theme.radius.xs}px ${theme.radius.xs}px`,
  },
})

export const Separator = styled.hr({
  height: 1,
  backgroundColor: theme.colors.borderOpaque,
  marginInline: theme.space.md,
})

export const TierItemContainer = styled.div<{ isSelected: boolean }>(({ isSelected = false }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xs,
  padding: theme.space.xs,
  borderRadius: theme.radius.xs,

  boxShadow: isSelected ? '0px 1px 2px rgba(0, 0, 0, 0.15)' : '',
  backgroundColor: isSelected ? theme.colors.green50 : 'transparent',
}))

export const TitleContainer = styled.div({
  fontSize: theme.fontSizes[3],
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
})

export const TitleItem = styled.div({
  paddingBottom: theme.space.xxs,
})
