import styled from '@emotion/styled'
import { CheckIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type ListItemProps = {
  title: string
  children?: React.ReactNode
}

export const CheckedListItem = ({ title }: ListItemProps) => (
  <CheckListItem checked>
    <SpaceFlex align="center" space={0.5}>
      <PresentationCheckboxChecked>
        <CheckIcon size="1rem" />
      </PresentationCheckboxChecked>
      <Text>{title}</Text>
    </SpaceFlex>
  </CheckListItem>
)

export const UncheckedListItem = ({ children, title }: ListItemProps) => (
  <CheckListItem>
    <SpaceFlex align="center" space={0.5}>
      <PresentationCheckboxUnchecked />
      <Text>{title}</Text>
    </SpaceFlex>
    <CheckListItemContent>{children}</CheckListItemContent>
  </CheckListItem>
)

export const StyledCheckList = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,
  listStyle: 'none',
})

const CheckListItem = styled.li<{ checked?: boolean }>(({ checked = false }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  paddingInline: theme.space.md,
  color: theme.colors.textPrimary,
  textDecoration: 'none',
  gap: theme.space.md,

  ...(checked && {
    color: theme.colors.textDisabled,
    textDecoration: 'line-through',
  }),
}))

const CheckListItemContent = styled.div({
  paddingLeft: `calc(${theme.space.lg} + ${theme.space.xs})`,
})

const PresentationCheckboxBase = styled.div({
  height: theme.space.lg,
  width: theme.space.lg,
  color: theme.colors.white,
  borderRadius: theme.radius.xs,
})

const PresentationCheckboxChecked = styled(PresentationCheckboxBase)({
  display: 'grid  ',
  placeItems: 'center',
  backgroundColor: theme.colors.green600,
})

const PresentationCheckboxUnchecked = styled(PresentationCheckboxBase)({
  backgroundColor: 'transparent',
  border: `2px solid ${theme.colors.gray300}`,
})
