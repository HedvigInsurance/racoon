import styled from '@emotion/styled'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export const InputField = (props: InputFieldProps) => {
  return <StyledInput {...props} />
}

const StyledInput = styled.input(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  borderRadius: theme.radius.sm,
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingTop: theme.space[3],
  paddingBottom: theme.space[3],

  width: '100%',

  fontSize: theme.fontSizes[5],
  color: theme.colors.gray900,

  '::placeholder': {
    color: theme.colors.gray500,
  },

  ':hover, :focus': {
    backgroundColor: theme.colors.gray300,
  },

  /* Only show while not focused and if a value is entered */
  ':not(:focus):not(:placeholder-shown):valid': {
    backgroundColor: 'hsla(82, 74%, 71%, 0.6)',
  },
}))
