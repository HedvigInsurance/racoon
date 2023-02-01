import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { ChevronIcon, theme } from 'ui'

export const Root = AccordionPrimitives.Root
export const Content = AccordionPrimitives.Content
export const Item = AccordionPrimitives.Item
const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)({
  height: theme.space.xxl,
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.gray200,
  borderRadius: theme.radius.xs,
  padding: `0 ${theme.space.md}`,

  '[data-state=open] &': {
    borderRadius: `${theme.radius.xs}px ${theme.radius.xs}px 0 0`,
  },
})

const CenteredHeader = styled.div({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-between',
  paddingRight: '1rem',
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
  marginRight: '.5rem',
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
  backgroundColor: theme.colors.gray200,

  ':not(:first-of-type)': {
    paddingTop: 0,
  },

  '&:first-of-type': {
    borderTop: `1px solid ${theme.colors.gray300}`,
  },
  '&:last-of-type': {
    borderRadius: `0 0 ${theme.radius.xs}px ${theme.radius.xs}px`,
  },
})

export const TierItemContainer = styled.div<{ isSelected: boolean }>(({ isSelected = false }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.space.xs,
  borderRadius: `${theme.radius.xs}px`,

  boxShadow: isSelected ? '0px 1px 2px rgba(0, 0, 0, 0.15)' : '',
  backgroundColor: isSelected ? '#E9FFC8' : theme.colors.gray200,
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

export const SecondaryText = styled.div({
  color: theme.colors.gray600,
})

export const PriceText = styled.div<{ isSelected: boolean }>(({ isSelected }) => ({
  color: isSelected ? theme.colors.gray900 : theme.colors.gray600,
}))
