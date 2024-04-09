import styled from '@emotion/styled'
import type { ReactNode} from 'react';
import { useId } from 'react'
import { Space, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import type { SwitchProps} from '../Switch';
import { Switch, SwitchWrapper } from '../Switch'

type Props = SwitchProps & {
  label: string
  Icon?: ReactNode
}

export const ToggleCard = ({
  id,
  label,
  children,
  onCheckedChange,
  Icon,
  ...checkboxProps
}: Props) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()
  const backupId = useId()
  const identifier = id || backupId

  const handleCheckedChange = (checked: boolean) => {
    highlight()
    onCheckedChange?.(checked)
  }

  return (
    <InputWrapper {...animationProps}>
      <Space y={0.5}>
        <CheckboxHeader>
          <SpaceFlex align="center" space={0.5}>
            {Icon}
            <StyledLabel htmlFor={identifier}>{label}</StyledLabel>
          </SpaceFlex>
          <Switch id={identifier} onCheckedChange={handleCheckedChange} {...checkboxProps} />
        </CheckboxHeader>
        {children}
      </Space>
    </InputWrapper>
  )
}

const InputWrapper = styled.div({
  padding: theme.space.md,
  paddingTop: theme.space.sm,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.opaque1,
  [`:has(${SwitchWrapper}[aria-checked=true])`]: { backgroundColor: theme.colors.signalGreenFill },
})

const CheckboxHeader = styled.div({
  display: 'flex',
  gap: theme.space.sm,
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledLabel = styled.label({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.md,

  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})
