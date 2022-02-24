import { InputBase, InputBaseProps } from 'ui'

import styled from '@emotion/styled'

const Wrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridAutoFlow: 'column',
  gap: '1rem',
})

const RadioButton = styled.input(({ theme }) => ({
  appearance: 'none',
  margin: 0,

  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.gray500}`,
  width: '100%',
  height: '100%',
  cursor: 'pointer',

  padding: '1rem',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.colors.gray300,

  '::placeholder': {
    color: theme.colors.gray500,
  },

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: theme.colors.gray900,
  },

  ':disabled': {
    backgroundColor: theme.colors.gray300,
    borderColor: theme.colors.gray300,
    color: theme.colors.gray500,
    cursor: 'not-allowed',
  },

  ':checked': {
    borderColor: theme.colors.gray900,
    borderWidth: '2px',
  },
}))
RadioButton.defaultProps = { type: 'radio' }

const InputRadioWrapper = styled.div({
  height: '5rem',
  position: 'relative',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Label = styled.label(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  position: 'absolute',
}))

type InputRadioProps = {
  id: string
  label: string
  name: string
  value: string
  checked?: boolean
  defaultChecked?: boolean
}

export const InputRadio = ({ id, label, value, ...props }: InputRadioProps) => {
  return (
    <InputRadioWrapper>
      <RadioButton id={id} value={value ? 'YES' : 'NO'} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </InputRadioWrapper>
  )
}

type Props = InputBaseProps & {
  children: React.ReactNode
}

export const RadioGroup = ({ children, ...props }: Props) => {
  return <InputBase {...props}>{() => <Wrapper>{children}</Wrapper>}</InputBase>
}
