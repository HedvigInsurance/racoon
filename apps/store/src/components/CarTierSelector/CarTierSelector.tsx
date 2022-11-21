import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { ChevronIcon } from 'ui'

export const Root = AccordionPrimitives.Root
export const Content = AccordionPrimitives.Content

export const Item = styled(AccordionPrimitives.Item)(({ theme }) => ({
  padding: theme.space[2],
}))

const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)(({ theme }) => ({
  height: theme.space[7],
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'space-between',
  background: theme.colors.gray200,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
  borderRadius: theme.radius.xs,
  borderBottom: `1px solid ${theme.colors.gray500}`,
  padding: `0 ${theme.space[4]}`,

  '[data-state=open] &': { borderRadius: `${theme.radius.xs} ${theme.radius.xs} 0 0` },
}))

const CenteredHeader = styled.div({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-around',
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
  paddingTop: theme.space[5],
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

const TierItemContainer = styled.div<{ isSelected: boolean }>(({ theme, isSelected = false }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.space[4],
  backgroundColor: isSelected ? '#E0F6BE' : theme.colors.gray200,

  '&:last-of-type': {
    borderRadius: `0 0 ${theme.radius.xs} ${theme.radius.xs}`,
  },
}))

const TitleContainer = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes[3],
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}))

const TitleItem = styled.div(({ theme }) => ({
  paddingBottom: theme.space[1],
}))

export const SecondaryTextStyle = styled.div(({ theme }) => ({
  color: theme.colors.gray700,
}))

export type TierItemProps = {
  title: string
  price: string
  body: string
  isSelected?: boolean
  recommendedText?: string
  children?: React.ReactNode
  handleClick?: (id: any) => void
} & AccordionPrimitives.AccordionItemProps

export const TierItem = ({
  title,
  price,
  body,
  isSelected = false,
  recommendedText = '',
  handleClick,
}: TierItemProps) => {
  return (
    <TierItemContainer isSelected={isSelected} onClick={handleClick}>
      <TitleContainer>
        <TitleItem>{title}</TitleItem>
        <TitleItem>
          <SecondaryTextStyle>{price}</SecondaryTextStyle>
        </TitleItem>
      </TitleContainer>
      <SecondaryTextStyle>{body}</SecondaryTextStyle>
      {recommendedText ? <RecommendedItem>{recommendedText}</RecommendedItem> : null}
    </TierItemContainer>
  )
}
