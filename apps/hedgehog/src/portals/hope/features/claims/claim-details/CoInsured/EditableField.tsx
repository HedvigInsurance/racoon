import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import chroma from 'chroma-js'
import * as React from 'react'

const Field = styled.div<{ primary: boolean }>`
  display: inline-flex;
  font-size: ${({ primary }) => (primary ? '1.3em' : '1em')};
  color: ${({ theme, primary }) =>
    primary
      ? theme.accentContrast
      : chroma(theme.accentContrast).alpha(0.5).hex()};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  border-radius: 6px;
  padding-left: 0.2rem;
  padding-top: 0.15rem;
`

const FieldInput = styled.input<{ primary: boolean }>`
  display: inline-flex;
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) =>
    chroma(theme.accentContrast).alpha(0.1).hex()};

  font-size: ${({ primary }) => (primary ? '1.3em' : '1em')};
  font-family: inherit;
  outline: none;
  border: none;
  border-radius: 6px;
  margin-left: -2px;
  width: 100%;

  padding-left: 0.35rem;
  padding-top: 0.35rem;
  padding-right: 0.35rem;

  ::placeholder {
    color: ${({ theme }) => chroma(theme.accentContrast).alpha(0.6).hex()};
  }
`

export const EditableField: React.FC<{
  primary?: boolean
  icon?: React.ReactNode
  value: string
  placeholder: string
  pattern?: string
  required?: boolean
  type?: string
  editing: boolean
  onChange: (value: string) => void
}> = ({
  primary = false,
  icon,
  value,
  placeholder,
  pattern,
  required,
  type,
  editing,
  onChange,
}) => {
  if (!editing) {
    return (
      <Field primary={primary}>
        {value && icon}
        {value.slice(0, 40)}
      </Field>
    )
  }

  return (
    <Flex direction="row">
      {icon}
      <FieldInput
        primary={primary}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </Flex>
  )
}
