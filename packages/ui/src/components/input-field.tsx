import { Space } from './space'
import { WarningTriangleIcon } from '../icons/warning-triangle-icon'
import { colorsV3 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

type ErrorProps = { $error: boolean }

const InputWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
})

const StyledInput = styled.input<ErrorProps>(
  {
    color: colorsV3.gray900,
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    textTransform: 'uppercase',
    padding: '1rem',
    width: '100%',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',

    '::placeholder': {
      color: colorsV3.gray500,
    },

    ':focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      borderColor: colorsV3.gray900,
    },

    ':disabled': {
      backgroundColor: colorsV3.gray300,
      color: colorsV3.gray500,
    },
  },
  ({ $error }) => ({
    borderColor: $error ? colorsV3.red500 : colorsV3.gray300,

    ':focus': {
      borderColor: $error ? colorsV3.red500 : colorsV3.gray500,
    },
  }),
)

const ErrorMessageWrapper = styled(Space)<ErrorProps>(
  {
    display: 'flex',
    alignItems: 'center',
  },
  ({ $error }) => ({
    opacity: $error ? 1 : 0,
  }),
)

const StyledWarningTriangleIcon = styled(WarningTriangleIcon)({
  color: colorsV3.red600,
  width: '1rem',
  height: '1rem',
})

const ErrorMessage = styled.span<ErrorProps>(
  {
    color: colorsV3.red600,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  ({ $error }) => ({
    opacity: $error ? 1 : 0,
  }),
)

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
