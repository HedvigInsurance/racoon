import { Space } from './space'
import { WarningTriangleIcon } from '../icons/warning-triangle-icon'
import styled from '@emotion/styled'

type ErrorProps = { $error: boolean }

const InputWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
})

const StyledInput = styled.input<ErrorProps>(({ theme, $error }) => ({
  color: theme.colors.gray900,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  textTransform: 'uppercase',
  padding: '1rem',
  width: '100%',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',

  '::placeholder': {
    color: theme.colors.gray500,
  },

  ':focus': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: $error ? theme.colors.red500 : theme.colors.gray900,
  },

  ':disabled': {
    backgroundColor: theme.colors.gray300,
    color: theme.colors.gray500,
  },

  borderColor: $error ? theme.colors.red500 : theme.colors.gray300,
}))

const ErrorMessageWrapper = styled(Space)<ErrorProps>(({ $error }) => ({
  display: 'flex',
  alignItems: 'center',
  opacity: $error ? 1 : 0,
}))

const StyledWarningTriangleIcon = styled(WarningTriangleIcon)(({ theme }) => ({
  color: theme.colors.red600,
  width: '1rem',
  height: '1rem',
}))

const ErrorMessage = styled.span<ErrorProps>(({ theme, $error }) => ({
  color: theme.colors.red600,
  fontSize: '0.75rem',
  lineHeight: '1rem',
  opacity: $error ? 1 : 0,
}))

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string
}

export const InputField = ({ className, errorMessage, ...props }: InputFieldProps) => {
  const hasError = errorMessage !== undefined
  const errorMessageId = `${props.id}-error`

  return (
    <Space y={0.25}>
      <InputWrapper>
        <StyledInput
          aria-invalid={hasError}
          aria-describedby={hasError ? errorMessageId : undefined}
          $error={hasError}
          {...props}
        />
      </InputWrapper>

      <ErrorMessageWrapper x={0.25} $error={hasError}>
        <StyledWarningTriangleIcon />
        <ErrorMessage id={errorMessageId} aria-hidden={!hasError} $error={hasError}>
          {errorMessage || 'PLACEHOLDER'}
        </ErrorMessage>
      </ErrorMessageWrapper>
    </Space>
  )
}
