import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useId } from 'react'
import { Space, theme } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { Switch, SwitchProps } from '../Switch'

type Props = SwitchProps & {
  label: string
}

export const ToggleCard = ({ id, label, children, onCheckedChange, ...checkboxProps }: Props) => {
  const { highlight, animationProps } = useHighlightAnimation()
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
          <StyledLabel htmlFor={identifier}>{label}</StyledLabel>
          <Switch id={identifier} onCheckedChange={handleCheckedChange} {...checkboxProps} />
        </CheckboxHeader>
        {children}
      </Space>
    </InputWrapper>
  )
}

const InputWrapper = styled(motion.div)({
  backgroundColor: theme.colors.opaque1,
  padding: theme.space.md,
  borderRadius: theme.radius.sm,
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
