import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { ChevronIcon } from 'ui'

export const Root = AccordionPrimitives.Root
export const Content = AccordionPrimitives.Content
export const Item = AccordionPrimitives.Item
const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)(({ theme }) => ({
  height: theme.space[7],
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.gray200,
  borderRadius: theme.radius.xs,
  padding: `0 ${theme.space[4]}`,

  '[data-state=open] &': {
    borderRadius: `${theme.radius.xs}px ${theme.radius.xs}px 0 0`,
  },
}))

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

const RecommendedContainer = styled.div(({ theme }) => ({
  paddingTop: theme.space[2],
}))

const RecommendedDot = styled.span(({ theme }) => ({
  display: 'inline-block',
  height: theme.radius.sm,
  width: theme.radius.sm,
  backgroundColor: theme.colors.black,
  borderRadius: '50%',
  marginRight: '.5rem',
}))

type RecommendedItemProps = {
  children: React.ReactNode
}

export const RecommendedItem = ({ children }: RecommendedItemProps) => (
  <RecommendedContainer>
    <RecommendedDot />
    {children}
  </RecommendedContainer>
)

export const TierItemWrapper = styled.div<{ isSelected: boolean }>(({ theme }) => ({
  cursor: 'pointer',
  padding: theme.space[2],
  backgroundColor: theme.colors.gray200,

  '&:first-of-type': {
    borderTop: `1px solid ${theme.colors.gray300}`,
  },
  '&:last-of-type': {
    borderRadius: `0 0 ${theme.radius.xs}px ${theme.radius.xs}px`,
  },
}))

export const TierItemContainer = styled.div<{ isSelected: boolean }>(
  ({ theme, isSelected = false }) => ({
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.space[2],
    borderRadius: `${theme.radius.xs}px`,

    boxShadow: isSelected ? '0px 1px 2px rgba(0, 0, 0, 0.15)' : '',
    backgroundColor: isSelected ? '#E9FFC8' : theme.colors.gray200,
  }),
)

export const TitleContainer = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes[3],
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}))

export const TitleItem = styled.div(({ theme }) => ({
  paddingBottom: theme.space[1],
}))

export const SecondaryTextStyle = styled.div(({ theme }) => ({
  color: theme.colors.gray600,
}))
