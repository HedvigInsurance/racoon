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


const DisabledTick = styled.div<{ disabled?: boolean }>(
  {
    position: 'absolute',
    width: 10,
    height: 2,
  },
  (props) => ({
    backgroundColor: props.theme.colors.gray500,
    display: props.disabled ? 'initial' : 'none',
  }),
)

export const Checkbox = ({
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
    <StyledCheckbox {...{ checked, onClick: !disabled ? onChange : () => {}, disabled }}>
      <DisabledTick disabled={disabled} />
      <Icon disabled={disabled} checked={checked} />
    </StyledCheckbox>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </ControlContainer>
)
