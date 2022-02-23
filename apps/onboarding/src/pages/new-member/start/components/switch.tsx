import React from 'react'
import { Tick } from './icons/tick'
import styled from '@emotion/styled'

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  labelText: string
  isChecked: boolean
}

const Wrapper = styled.label({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
})

const SwitchContainer = styled.span<Pick<SwitchProps, 'isChecked'>>(({ theme, isChecked }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '1.25rem',
  width: '1.25rem',
  border: `1px solid ${theme.colors.gray900}`,
  borderRadius: '2px',
  cursor: 'pointer',
  backgroundColor: isChecked ? theme.colors.gray900 : 'transparent',
}))

/**
 * Visually hidden checkbox for accessiblity reasons
 */
const HiddenCheckbox = styled.input({
  opacity: 0,
  margin: 0,
  position: 'absolute',
  cursor: 'pointer',
})

const LabelText = styled.span(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '0.875rem',
}))

export const Switch = ({ labelText, isChecked, onChange, ...rest }: SwitchProps) => {
  return (
    <Wrapper>
      <HiddenCheckbox type="checkbox" onChange={onChange} checked={isChecked} {...rest} />
      <SwitchContainer aria-hidden={true} isChecked={isChecked}>
        {isChecked && <Tick />}
      </SwitchContainer>
      <LabelText>{labelText}</LabelText>
    </Wrapper>
  )
}
