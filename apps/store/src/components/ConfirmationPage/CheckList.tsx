import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { CheckIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type ListItemProps = {
  title: string
  children?: React.ReactNode
}

const CheckedListItem = ({ title, children }: ListItemProps) => (
  <StyledCheckedListItem>
    <SpaceFlex align="center" space={0.5}>
      <PresentationCheckboxChecked>
        <CheckIcon size="1rem" />
      </PresentationCheckboxChecked>
      <Text>{title}</Text>
    </SpaceFlex>
    {children && <CheckListItemContent>{children}</CheckListItemContent>}
  </StyledCheckedListItem>
)

const UncheckedListItem = ({ title, children }: ListItemProps) => (
  <StyledUncheckedListItem>
    <SpaceFlex align="center" space={0.5}>
      <PresentationCheckboxUnchecked />
      <Text>{title}</Text>
    </SpaceFlex>
    {children && <CheckListItemContent>{children}</CheckListItemContent>}
  </StyledUncheckedListItem>
)

export const CheckListItem = {
  Checked: CheckedListItem,
  Unchecked: UncheckedListItem,
}

export const CheckList = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,
})

const CheckListItemBase = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  gap: theme.space.md,
})

const StyledCheckedListItem = styled.li(
  {
    color: theme.colors.textDisabled,
    textDecoration: 'line-through',
  },
  CheckListItemBase,
)

const StyledUncheckedListItem = styled.li({}, CheckListItemBase)

const CheckListItemContent = styled.div({
  paddingLeft: `calc(${theme.space.lg} + ${theme.space.xs})`,
})

const PresentationCheckboxBase = css({
  height: theme.space.lg,
  width: theme.space.lg,
  color: theme.colors.white,
  borderRadius: theme.radius.xs,
})

const PresentationCheckboxChecked = styled.div(
  {
    display: 'grid  ',
    placeItems: 'center',
    backgroundColor: theme.colors.green600,
  },
  PresentationCheckboxBase,
)

const PresentationCheckboxUnchecked = styled.div(
  {
    backgroundColor: 'transparent',
    border: `2px solid ${theme.colors.gray300}`,
  },
  PresentationCheckboxBase,
)
