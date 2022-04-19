import styled from '@emotion/styled'
import { useState } from 'react'
import { InputField } from 'ui'
import type { InputFieldProps } from 'ui'

const OverlayPlaceholder = styled.p(({ theme }) => ({
  margin: 0,
  padding: 0,
  pointerEvents: 'none',

  fontSize: '1.125rem',
  lineHeight: 0,
  color: theme.colors.gray500,

  position: 'absolute',
  top: '50%',
  left: 'calc(1rem + 2px)',
}))

const HiddenText = styled.span({
  opacity: 0,
})

export const InputFieldWithHint = ({ onChange, ...props }: InputFieldProps) => {
  const stringValue = props.value?.toString()
  const [internalValue, setInternalValue] = useState(stringValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value)
    onChange && onChange(event)
  }

  const currentValue = stringValue ?? internalValue
  const hasStartedTyping = currentValue ? currentValue.length > 0 : false
  const visisblePlaceholder = currentValue
    ? props.placeholder?.slice(currentValue.length)
    : undefined

  return (
    <InputField {...props} onChange={handleChange}>
      {hasStartedTyping && (
        <OverlayPlaceholder aria-hidden={true}>
          <HiddenText>{currentValue}</HiddenText>
          {visisblePlaceholder}
        </OverlayPlaceholder>
      )}
    </InputField>
  )
}
