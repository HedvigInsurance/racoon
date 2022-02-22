import { InputBase, InputBaseProps } from './input-base'

import styled from '@emotion/styled'
import { useState } from 'react'

type ErrorProps = { $error: boolean }

const Wrapper = styled.div<ErrorProps>(({ theme, $error }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  height: '5rem',
  boxSizing: 'border-box',

  padding: '1rem',
  width: '100%',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',

  ':focus-within, :hover': {
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

const StepButton = styled.button(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '1rem',

  appearance: 'none',
  border: '1px solid',
  borderColor: theme.colors.gray500,

  height: '2rem',
  width: '2rem',
  borderRadius: '50%',
  backgroundColor: 'transparent',

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: theme.colors.gray900,
  },
}))

const StepButtonRight = styled(StepButton)(({ theme }) => ({
  left: 'auto',
  right: '1rem',
}))

const StyledInput = styled.input(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  textAlign: 'center',
  backgroundColor: 'transparent',
  border: 0,

  '::placeholder': {
    color: theme.colors.gray500,
  },
}))

type Props = React.InputHTMLAttributes<HTMLInputElement> & InputBaseProps

export const InputStepper = (props: Props) => {
  const [value, setValue] = useState(props.defaultValue || '0')

  const step = Number(props.step) || 1

  const handleClick = (direction: 'up' | 'down') => {
    const newValue = direction === 'up' ? Number(value) + step : Number(value) - step

    if (props.min !== undefined && newValue < Number(props.min)) return
    if (props.max !== undefined && newValue > Number(props.max)) return

    setValue(newValue.toString())
  }

  return (
    <InputBase {...props}>
      {({ hasError, errorMessageId }) => (
        <Wrapper $error={hasError}>
          <StepButton onClick={() => handleClick('down')}>-</StepButton>

          <StyledInput
            aria-invalid={hasError}
            aria-describedby={hasError ? errorMessageId : undefined}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            tabIndex={-1}
            readOnly
            {...props}
          />

          <StepButtonRight onClick={() => handleClick('up')}>+</StepButtonRight>
        </Wrapper>
      )}
    </InputBase>
  )
}
