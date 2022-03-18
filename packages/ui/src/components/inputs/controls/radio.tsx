import styled from '@emotion/styled'
import React from 'react'
import {
  ControlContainer,
  ControlLabel,
  ControlProps,
  HiddenInput,
  Icon,
  StyledCheckbox,
} from './base'


const StyledRadio = styled(StyledCheckbox)({ borderRadius: '50%' })

export const Radio = ({
  disabled,
  checked,
  onChange,
  label,
  prependLabel,
  containerStyles,
}: ControlProps) => (
  <ControlContainer style={containerStyles}>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledRadio {...{ checked, onClick: !disabled ? onChange : () => {}, disabled }}>
      <Icon checked={checked} disabled={disabled} />
    </StyledRadio>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </ControlContainer>
)
