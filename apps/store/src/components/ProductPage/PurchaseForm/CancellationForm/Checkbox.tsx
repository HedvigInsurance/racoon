import styled from '@emotion/styled'
import * as RadixSwitch from '@radix-ui/react-switch'

export type CheckboxProps = RadixSwitch.SwitchProps

export const Checkbox = (props: CheckboxProps) => {
  return (
    <SwitchWrapper {...props}>
      <SwitchHandle />
    </SwitchWrapper>
  )
}

const SwitchWrapper = styled(RadixSwitch.Root)(({ theme }) => ({
  width: 48,
  height: 24,
  borderRadius: 12,
  border: `2px solid ${theme.colors.gray500}`,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.colors.gray500,
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',

  ':focus': {
    outline: `5px auto ${theme.colors.purple700}`,
  },

  '&[data-state=checked]': {
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.black,
    justifyContent: 'flex-end',
  },
}))

const SwitchHandle = styled(RadixSwitch.Thumb)(({ theme }) => ({
  width: 12,
  height: 12,
  backgroundColor: theme.colors.gray500,
  borderRadius: 12,

  '&[data-state=checked]': {
    backgroundColor: theme.colors.white,
  },
}))
