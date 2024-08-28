import styled from '@emotion/styled'
import { InputHTMLAttributes } from 'react'
import * as React from 'react'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'
import { Navigation } from '../Navigation/Navigation'

const RadioLabel = styled.div<{ checked?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  outline: none;
  pointer-events: ${({ disabled }) => (!disabled ? 'auto' : 'none')};

  & label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-left: 25px;
    font-size: 14px;

    &::before {
      content: '';
      transition: all 0.2s;
      width: 15px;
      height: 15px;
      position: absolute;
      left: 0;
      border-radius: 50%;
      background-color: ${({ theme, checked, disabled }) =>
        checked && !disabled
          ? theme.accent
          : disabled
            ? theme.accentBackground
            : 'transparent'};
      border: 1px solid
        ${({ theme, checked, disabled }) =>
          checked && !disabled
            ? theme.accent
            : disabled
              ? theme.accentBackground
              : theme.border};
    }

    &::after {
      content: '';
      transition: all 0.2s;
      width: 13px;
      height: 13px;
      position: absolute;
      left: 1px;
      border: ${({ checked, theme }) =>
        checked ? `2px solid ${theme.backgroundLight}` : 'none'};
      border-radius: 50%;
      background-color: ${({ theme, checked, disabled }) =>
        checked && !disabled
          ? theme.accent
          : disabled
            ? theme.accentBackground
            : 'transparent'};
    }
  }

  &:focus {
    & label::before {
      box-shadow: 0 0 5px 1px rgba(34, 60, 80, 0.4);
    }
  }

  & input {
    display: none;
  }
`

interface RadioGroupProps {
  value?: string | number
  onChange?: (value: string | number) => void
  options: {
    value: string | number
    label: string | React.ReactNode
    disabled?: boolean
  }[]
  navName?: string
  horizontal?: boolean
  edges?: {
    up?: string
    down?: string
    left?: string
    right?: string
  }
}

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onKeyDown'> {
  label: string | React.ReactNode
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

export const Radio: React.FC<RadioProps> = ({
  value,
  label,
  id,
  onKeyDown,
  checked,
  disabled,
  ...props
}) => (
  <RadioLabel
    tabIndex={!disabled ? 0 : -1}
    onKeyDown={onKeyDown}
    checked={checked}
    disabled={disabled}
  >
    <input
      tabIndex={-1}
      type="radio"
      id={id}
      name="group"
      value={value}
      checked={checked}
      disabled={disabled}
      {...props}
    />
    <label htmlFor={id}>{label}</label>
  </RadioLabel>
)

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  navName,
  horizontal,
  edges,
}) => (
  <>
    {options.map((opt, idx) => (
      <Navigation
        key={`${opt.value}` + idx}
        style={{
          borderRadius: '0.5rem',
        }}
        name={navName ? `${navName}-${idx}` : `radio-${idx}`}
        options={{
          neighbors: {
            [horizontal ? 'left' : 'up']:
              idx === 0
                ? horizontal
                  ? edges?.left
                  : edges?.up
                : navName
                  ? `${navName}-${idx - 1}`
                  : `radio-${idx - 1}`,
            [horizontal ? 'right' : 'down']:
              idx === options.length - 1
                ? horizontal
                  ? edges?.right
                  : edges?.down
                : navName
                  ? `${navName}-${idx + 1}`
                  : `radio-${idx + 1}`,
          },
          resolve: () => {
            onChange && onChange(opt.value)
          },
        }}
      >
        <Radio
          id={`${opt.value}` + idx}
          value={opt.value}
          label={opt.label}
          disabled={opt.disabled || false}
          onChange={() => onChange && onChange(opt.value)}
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Enter)) {
              onChange?.(opt.value)
              return
            }
          }}
          checked={opt.value === value || false}
        />
      </Navigation>
    ))}
  </>
)
