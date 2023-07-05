import styled from '@emotion/styled'
import { theme, InputBase, InputBaseProps } from 'ui'

type StyleProps = { $error: boolean; $suffix?: string }

const Wrapper = styled.div(({ $suffix }: StyleProps) => ({
  position: 'relative',
  display: 'inline-block',
  width: '100%',

  '::after': {
    content: $suffix ? `"${$suffix}"` : '""',
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
  },
}))

const StyledInput = styled.input<StyleProps>(({ $error }) => ({
  backgroundColor: theme.colors.white,
  color: theme.colors.textPrimary,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  padding: '0 1rem',
  width: '100%',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  height: '3.5rem',

  '::placeholder': {
    color: theme.colors.textTertiary,
  },

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: $error ? theme.colors.red500 : theme.colors.gray900,
  },

  ':disabled': {
    backgroundColor: theme.colors.gray300,
    borderColor: theme.colors.gray300,
    color: theme.colors.textDisabled,
    cursor: 'not-allowed',
  },

  borderColor: $error ? theme.colors.red500 : theme.colors.gray300,
}))

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputBaseProps & {
    suffix?: string
  }

export const InputField = ({ suffix, children, ...props }: InputFieldProps) => {
  return (
    <InputBase {...props}>
      {({ hasError, errorMessageId }) => (
        <Wrapper $error={hasError} $suffix={suffix}>
          <StyledInput
            aria-invalid={hasError}
            aria-describedby={hasError ? errorMessageId : undefined}
            $error={hasError}
            $suffix={suffix}
            {...props}
          />

          {children}
        </Wrapper>
      )}
    </InputBase>
  )
}
