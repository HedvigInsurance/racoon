import styled from '@emotion/styled'
import { ChangeEvent, InputHTMLAttributes } from 'react'
import * as React from 'react'
import { Check as CheckIcon } from 'react-bootstrap-icons'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'

const Check = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;
  font-size: 14px;

  .checkbox__input:focus + .checkbox {
    box-shadow: 0 0 0 0.1em ${({ theme }) => theme.accent};
  }
`

const CheckInput = styled.input`
  width: auto;
  appearance: none;
`

const CheckboxStyled = styled.span<{ checked?: boolean; disabled?: boolean }>`
  width: 15px;
  height: 15px;

  margin-right: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 0.05em;
  background-color: ${({ theme, disabled }) =>
    !disabled ? theme.backgroundLight : theme.background};
  box-shadow: 0 0 0 0.1em
    ${({ theme, disabled }) =>
      !disabled ? theme.border : theme.placeholderColor};

  &:hover,
  &:focus {
    box-shadow: 0 0 0 0.1em
      ${({ theme, disabled }) =>
        !disabled ? theme.borderStrong : theme.placeholderColor};
  }
`

const CheckIconStyled = styled(CheckIcon)`
  width: 100%;
  height: 100%;
`
const Wrapper = styled.div`
  width: auto;
`

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  checked?: boolean
  disabled?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  disabled,
  className,
  style,
  onChange,
  ...props
}) => (
  <Check style={style} className={className}>
    <CheckInput
      className="checkbox__input"
      tabIndex={0}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter)) {
          e.preventDefault()
          onChange?.(e as unknown as ChangeEvent<HTMLInputElement>)
        }
      }}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      {...props}
    />
    <Wrapper>
      <CheckboxStyled
        disabled={disabled}
        checked={checked}
        className="checkbox"
      >
        {checked && <CheckIconStyled />}
      </CheckboxStyled>
    </Wrapper>
    {label ?? null}
  </Check>
)
