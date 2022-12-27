import styled from '@emotion/styled'
import * as RadixSwitch from '@radix-ui/react-switch'

export type SwitchProps = RadixSwitch.SwitchProps

export const Switch = (props: SwitchProps) => {
  return (
    <SwitchWrapper {...props}>
      <SwitchHandle />
    </SwitchWrapper>
  )
}

const SwitchWrapper = styled(RadixSwitch.Root)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '1.75rem',
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',

  backgroundColor: theme.colors.gray500,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',

  ':focus': {
    borderColor: theme.colors.gray900,
  },

  '&[data-state=checked]': {
    backgroundColor: '#23CD61',
    justifyContent: 'flex-end',
  },
}))

const SwitchHandle = styled(RadixSwitch.Thumb)(({ theme }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  backgroundColor: theme.colors.white,
}))
