import { Space } from './space'
import { WarningTriangleIcon } from '../icons/warning-triangle-icon'
import styled from '@emotion/styled'

type ErrorProps = { $error: boolean }
type MessageProps = { $visible?: boolean }

const InputWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
})

const Label = styled.label(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray900,
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
}))

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

const MessageWrapper = styled(Space)<MessageProps>(({ $visible = true }) => ({
  display: 'flex',
  alignItems: 'center',
  opacity: $visible ? 1 : 0,
}))

const StyledWarningTriangleIcon = styled(WarningTriangleIcon)(({ theme }) => ({
  color: theme.colors.red600,
  width: '1rem',
  height: '1rem',
}))

const ErrorMessage = styled.span(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.red600,
  fontSize: '0.75rem',
  lineHeight: '1rem',
}))

const InfoMessage = styled.span(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray700,
  fontSize: '0.75rem',
  lineHeight: '1rem',
}))

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string
  infoMessage?: string
  label?: string
}

export const InputField = ({ errorMessage, infoMessage, label, ...props }: InputFieldProps) => {
  const hasError = errorMessage !== undefined
  const errorMessageId = `${props.id}-error`

  const hasInfo = infoMessage !== undefined && !hasError

  return (
    <Space y={0.5}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Space y={0.25}>
        <InputWrapper>
          <StyledInput
            aria-invalid={hasError}
            aria-describedby={hasError ? errorMessageId : undefined}
            $error={hasError}
            {...props}
          />
        </InputWrapper>

        {hasInfo ? (
          <MessageWrapper x={0.25}>
            <InfoMessage>{infoMessage}</InfoMessage>
          </MessageWrapper>
        ) : (
          <MessageWrapper x={0.25} $visible={hasError} aria-hidden={!hasError}>
            <StyledWarningTriangleIcon />
            <ErrorMessage id={errorMessageId}>{errorMessage || 'PLACEHOLDER'}</ErrorMessage>
          </MessageWrapper>
        )}
      </Space>
    </Space>
  )
}
