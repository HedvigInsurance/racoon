import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import React, { useState } from 'react'
import { StyledCheckbox } from '../Checkbox/Checkbox'
import { Card, CardProps } from './Card'

const SelectableWrapper = styled.div()

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const HiddenInput = styled.input({
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0px',
  width: '1px',
  position: 'absolute',
  whiteSpace: 'nowrap',
})

const SelectableCardElement = styled(Card)({
  cursor: 'pointer',
  ':hover': {
    borderColor: colorsV3.gray700,
  },
})

const TitleWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export type SelectableCardProps = CardProps & {
  selected?: boolean
  id: string
  name: string
  type: 'radio' | 'checkbox'
  onChange?: (isSelected: boolean) => void
}

export const SelectableCard = ({
  children,
  selected = false,
  title,
  id,
  name,
  onChange,
  type = 'checkbox',
  ...props
}: SelectableCardProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.checked)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const titleWithCheckbox = (
    <TitleWrapper>
      <StyledCheckbox circle checked={selected}></StyledCheckbox>
      {title}
    </TitleWrapper>
  )

  return (
    <SelectableWrapper>
      <HiddenInput
        checked={selected}
        onChange={handleChange}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        id={id}
      />
      <label htmlFor={id}>
        <SelectableCardElement
          {...props}
          isFocused={isFocused}
          isSelected={selected}
          //   onClick={handleChange}
          title={titleWithCheckbox}
        >
          {children}
        </SelectableCardElement>
      </label>
    </SelectableWrapper>
  )
}
