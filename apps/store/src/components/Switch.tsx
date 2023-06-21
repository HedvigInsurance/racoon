import styled from '@emotion/styled'
import * as RadixSwitch from '@radix-ui/react-switch'
import { theme } from 'ui'

export type SwitchProps = RadixSwitch.SwitchProps

export const Switch = (props: SwitchProps) => {
  return (
    <SwitchWrapper {...props}>
      <SwitchHandle />
    </SwitchWrapper>
  )
}

const SwitchWrapper = styled(RadixSwitch.Root)({
  boxSizing: 'border-box',
  width: '1.75rem',
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',

  backgroundColor: theme.colors.opaque3,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',

  ':focus-visible': {
    borderColor: theme.colors.gray1000,
  },

  '&[data-state=checked], &[data-state=open]': {
    backgroundColor: theme.colors.signalGreenElement,
  },

  '&[disabled]': {
    backgroundColor: theme.colors.opaque3,
    cursor: 'not-allowed',
  },
})

const SwitchHandle = styled(RadixSwitch.Thumb)({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  backgroundColor: theme.colors.textNegative,

  transition: 'transform 100ms',
  transform: 'translateX(0)',
  willChange: 'transform',

  '&[data-state=checked]': {
    transform: 'translateX(0.6rem)',
  },
})
