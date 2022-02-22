import React from 'react'
import { Tick } from './icons/tick'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const SwitchContainer = styled.span(({ theme }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '1.25rem',
  width: '1.25rem',
  border: '1px solid',
  borderRadius: '2px',
  cursor: 'pointer',
  backgroundColor: theme.colors.gray900,
}))

/**
 * Makes usage of a visually hidden checkbox for accessiblity reasons like
 * to make it discoverable for assistence tools and to enable binding it with
 * a <label> element.
 * Based on https://css-tricks.com/inclusively-hidden/
 */
const InclusiveHiddenCheckbox = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const Label = styled.label(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '0.875rem',
}))

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  labelText: string
}

export const Switch = ({ labelText, ...rest }: SwitchProps) => (
  <Wrapper>
    <InclusiveHiddenCheckbox type="checkbox" {...rest} />
    <SwitchContainer aria-hidden={true}>
      <Tick />
    </SwitchContainer>
    <Label>{labelText}</Label>
  </Wrapper>
)
