import * as React from 'react'
import styled from '@emotion/styled'
import { FieldErrors } from 'react-hook-form'
import { colors } from '@hedvig-ui/redesign/palette'
import {
  InputOrDropdownWrapper,
  InputOrDropdownWrapperProps,
} from '@hedvig-ui/redesign/InputOrDropdown'
import { useForwardRef } from '@hedvig-ui/hooks/use-forward-ref'
import {
  useDisableInputUpDownKeys,
  useDisableInputWheel,
} from '@hedvig-ui/hooks/use-disable-input-number-actions'

export interface InputProps
  extends InputOrDropdownWrapperProps,
    Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  error?: boolean
  success?: boolean
  loading?: boolean
  icon?: React.ReactNode
  affix?: { content?: string }
  errors?: FieldErrors
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, forwardRef) => {
    const {
      error,
      success,
      loading,
      icon,
      affix,
      errors,
      label,
      disabled,
      size,
      placeholder,
      ...rest
    } = props

    const ref = useForwardRef(forwardRef)
    useDisableInputWheel(ref.current)
    useDisableInputUpDownKeys(ref.current)

    return (
      <label>
        <StyledInputWrapper size={size} disabled={disabled}>
          {(!!label || !!placeholder) && (
            <span className="label">{label ?? placeholder}</span>
          )}
          <div className="value">
            <input
              ref={ref}
              placeholder={placeholder ?? ''}
              disabled={disabled}
              {...rest}
            />
          </div>

          {icon && <span className="icon">{icon}</span>}
          {affix?.content && <span className="affix">{affix.content}</span>}
        </StyledInputWrapper>
      </label>
    )
  },
)

const StyledInputWrapper = styled(InputOrDropdownWrapper)`
  cursor: text;

  &:has(.label) {
    align-items: flex-end;
  }

  .affix {
    border-radius: 8px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(var(--inner-height));
    white-space: nowrap;
    margin-right: calc((var(--padding-block) - var(--padding-inline)));

    color: ${colors.textSecondary};
  }

  .label {
    transition:
      top 150ms cubic-bezier(1, 0, 0, 1),
      transform 150ms cubic-bezier(1, 0, 0, 1),
      font-size 150ms cubic-bezier(1, 0, 0, 1);
  }

  &:has(input:placeholder-shown:not(:focus)) {
    .label {
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--font-size);
    }
  }
`
