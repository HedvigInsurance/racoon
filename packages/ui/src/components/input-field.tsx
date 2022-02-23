import { InputBase, InputBaseProps } from './input-base'

import styled from '@emotion/styled'

type ErrorProps = { $error: boolean }

const StyledInput = styled.input<ErrorProps>(({ theme, $error }) => ({
  color: theme.colors.gray900,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  padding: '1rem',
  width: '100%',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',

  '::placeholder': {
    color: theme.colors.gray500,
  },

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: $error ? theme.colors.red500 : theme.colors.gray900,
  },

  ':disabled': {
    backgroundColor: theme.colors.gray300,
    borderColor: theme.colors.gray300,
    color: theme.colors.gray500,
    cursor: 'not-allowed',
  },

  borderColor: $error ? theme.colors.red500 : theme.colors.gray300,
}))

type Props = React.InputHTMLAttributes<HTMLInputElement> & InputBaseProps

export const InputField = (props: Props) => {
  return (
    <InputBase {...props}>
      {({ hasError, errorMessageId }) => (
        <StyledInput
          aria-invalid={hasError}
          aria-describedby={hasError ? errorMessageId : undefined}
          $error={hasError}
          {...props}
        />
      )}
    </InputBase>
  )
}
