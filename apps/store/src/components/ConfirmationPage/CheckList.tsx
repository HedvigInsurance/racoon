import styled from '@emotion/styled'
import { CheckIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type ListItemProps = {
  title: string
  children?: React.ReactNode
}

export const ListItemChecked = ({ title }: ListItemProps) => {
  return (
    <CheckListItem checked>
      <SpaceFlex align="center" space={0.5}>
        <PresentationCheckboxChecked>
          <CheckIcon size="1rem" />
        </PresentationCheckboxChecked>
        <Text>{title}</Text>
      </SpaceFlex>
    </CheckListItem>
  )
}
export const ListItemUnchecked = ({ children, title }: ListItemProps) => {
  return (
    <CheckListItem>
      <SpaceFlex align="center" space={0.5}>
        <PresentationCheckboxUnchecked />
        <Text>{title}</Text>
      </SpaceFlex>
      <CheckListItemContent>{children}</CheckListItemContent>
    </CheckListItem>
  )
}

export const StyledCheckList = styled.ul({
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,
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

const PresentationCheckboxChecked = styled.div({
  display: 'grid  ',
  placeItems: 'center',
  backgroundColor: theme.colors.green600,
  borderRadius: theme.radius.xs,
  color: theme.colors.white,
  height: theme.space.lg,
  width: theme.space.lg,
})
const PresentationCheckboxUnchecked = styled.div({
  backgroundColor: 'transparent',
  height: theme.space.lg,
  border: `2px solid ${theme.colors.gray300}`,
  borderRadius: theme.radius.xs,
  color: theme.colors.white,
  width: theme.space.lg,
})
