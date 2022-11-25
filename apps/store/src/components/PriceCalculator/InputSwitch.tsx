import styled from '@emotion/styled'
import * as RadixSwitch from '@radix-ui/react-switch'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = RadixSwitch.SwitchProps & {
  label: string
}

export const InputSwitch = ({ label, ...props }: Props) => {
  const identifier = `checkbox-${props.name}`

  return (
    <SpaceFlex align="center" space={0.5}>
      <SwitchWrapper id={identifier} {...props}>
        <SwitchHandle />
      </SwitchWrapper>
      <Label htmlFor={identifier}>{label}</Label>
    </SpaceFlex>
  )
}

const Label = styled.label(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  fontFamily: theme.fonts.body,
}))

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
