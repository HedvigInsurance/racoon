import { CheckIcon } from '../../icons/check-mark'
import { ControlLabel } from './control-label'
import React from 'react'
import styled from '@emotion/styled'

export type RadioProps = {
  label?: string
  prependLabel?: boolean
  disabled?: boolean
  checked?: boolean
  onChange?: () => void
}

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled(CheckIcon)<{ checked?: boolean; disabled?: boolean }>`
  visibility: ${(props) => (props.checked && !props.disabled ? 'visible' : 'hidden')};
`

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
  &:focus + & {
    border: 2px solid ${(props) => props.theme.colors.gray900};
  }
`
const StyledRadio = styled.div<{
  checked?: boolean
  disabled?: boolean
}>`
  border-radius: 50%;
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
  box-sizing: border-box;
  transition: all 150ms;
  ${(props) =>
    !props.checked && !props.disabled && `border: 1px solid ${props.theme.colors.gray500};`}

  &:hover {
    ${(props) => !props.checked && `border: 2px solid ${props.theme.colors.gray900};`}
  }
`

const Radio = ({ disabled, checked, onChange, label, prependLabel }: RadioProps) => (
  <RadioContainer>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledRadio {...{ checked, onClick: !disabled ? onChange : () => {}, disabled }}>
      <Icon checked={checked} disabled={disabled} />
    </StyledRadio>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </RadioContainer>
)

export default Radio
