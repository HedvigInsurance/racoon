'use client'

import { useRef } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { FieldErrors } from 'react-hook-form'
import { Label } from '../Typography/typography'
import { ErrorMessage } from '@hookform/error-message'

const SelectStyled = styled.select`
  appearance: none;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  outline: none;

  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.25em;
  padding: 10px 15px;
  font-size: 14px;
  line-height: 1.1;
  background-color: #fff;

  &::-ms-expand {
    display: none;
  }
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Error = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.danger};
`

export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  name?: string
  value?: string
  options?: Array<{
    key?: string | number
    value: string
    text: string
    selected?: boolean
    disabled?: boolean
    hidden?: boolean
  }>
  label?: string
  errors?: FieldErrors
  wrapperStyle?: React.CSSProperties
  disabled?: boolean
  children?: Array<React.ReactElement<HTMLOptionElement>>
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, name, label, errors, children, wrapperStyle, ...props },
    forwardRef,
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null)

    const ref = forwardRef ?? internalRef

    return (
      <Wrapper style={wrapperStyle}>
        {label && <Label>{label}</Label>}
        <SelectStyled ref={ref} name={name} {...props}>
          {options
            ? options.map(({ key, text, value, ...option }) => (
                <option key={key ?? value} value={value} {...option}>
                  {text}
                </option>
              ))
            : children}
        </SelectStyled>
        {name && errors && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => <Error>{message}</Error>}
          />
        )}
      </Wrapper>
    )
  },
)
