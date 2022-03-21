import {
  ControlContainer,
  ControlLabel,
  ControlProps,
  HiddenInput,
  Icon,
  StyledCheckbox,
} from './base'

import React from 'react'
import styled from '@emotion/styled'

const StyledRadio = styled(StyledCheckbox)({ borderRadius: '50%' })

export const Radio = ({ disabled, checked, onChange, label, prependLabel }: ControlProps) => (
  <ControlContainer>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledRadio {...{ checked, onClick: !disabled ? onChange : () => {}, disabled }}>
      <Icon checked={checked} disabled={disabled} />
    </StyledRadio>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </ControlContainer>
)
