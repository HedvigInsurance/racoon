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
      <StrikeThroughText color="textTertiary">{title}</StrikeThroughText>
    </SpaceFlex>
    {children && <CheckListItemContent>{children}</CheckListItemContent>}
  </StyledCheckedListItem>
)

const DisabledListItem = ({ title, children }: ListItemProps) => (
  <StyledCheckedListItem>
    <SpaceFlex align="center" space={0.5}>
      <PresentationCheckboxDisabled>
        <CheckIcon size="1rem" />
      </PresentationCheckboxDisabled>
      <Text size={{ _: 'md', lg: 'lg' }}>{title}</Text>
    </SpaceFlex>
    {children && <CheckListItemContent>{children}</CheckListItemContent>}
  </StyledCheckedListItem>
)

export const CheckListItem = {
  Checked: CheckedListItem,
  Disabled: DisabledListItem,
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
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  gap: theme.space.md,
})

const StrikeThroughText = styled(Text)({
  textDecoration: 'line-through',
})

const StyledCheckedListItem = styled.li({}, CheckListItemBase)

const CheckListItemContent = styled.div({
  paddingLeft: `calc(${theme.space.lg} + ${theme.space.xs})`,
})

const PresentationCheckboxChecked = styled.div({
  height: theme.space.lg,
  width: theme.space.lg,
  color: theme.colors.white,
  borderRadius: theme.radius.xxs,
  display: 'grid  ',
  placeItems: 'center',
  backgroundColor: theme.colors.green600,
})

const PresentationCheckboxDisabled = styled(PresentationCheckboxChecked)({
  backgroundColor: theme.colors.textDisabled,
})
