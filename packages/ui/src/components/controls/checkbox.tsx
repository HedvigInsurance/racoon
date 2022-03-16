import { CheckIcon } from '../../icons/check-mark'
import { ControlLabel } from './control-label'
import React from 'react'
import styled from '@emotion/styled'

export type CheckboxProps = {
  label?: string
  prependLabel?: boolean
  disabled?: boolean
  checked: boolean
  onChange?: () => void
}

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled(CheckIcon)``

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenInput = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const DisabledTick = styled.div`
  position: absolute;
  width: 10px;
  height: 2px;
  background-color: ${(props) => props.theme.colors.gray500};
`
const StyledCheckbox = styled.div<{
  checked: boolean
  disabled?: boolean
}>`
  position: relative;
  cursor: ${(props) => (!props.disabled && 'pointer') || 'initial'};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin: 6px;
  background: ${(props) =>
    props.disabled
      ? props.theme.colors.gray300
      : props.checked
      ? props.theme.colors.gray900
      : 'initial'};
  border-radius: 2px;
  box-sizing: border-box;
  transition: all 150ms;
  ${(props) =>
    !props.checked && !props.disabled && `border: 1px solid ${props.theme.colors.gray500};`}

  ${HiddenInput}:focus + & {
    border: 2px solid ${(props) => props.theme.colors.gray900};
  }
  &:hover {
    ${(props) => !props.checked && `border: 2px solid ${props.theme.colors.gray900};`}
  }

  ${Icon} {
    visibility: ${(props) => (props.checked && !props.disabled ? 'visible' : 'hidden')};
  }
  ${DisabledTick} {
    display: ${(props) => (props.disabled ? 'initial' : 'none')};
  }
`

const Checkbox = ({ disabled, checked, onChange, label, prependLabel }: CheckboxProps) => (
  <CheckboxContainer>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledCheckbox {...{ checked, onClick: !disabled ? onChange : () => {}, disabled }}>
      <DisabledTick />
      <Icon />
    </StyledCheckbox>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </CheckboxContainer>
)

export default Checkbox
