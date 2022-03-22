import styled from '@emotion/styled'
import { CSSProperties } from 'react'
import { CheckIcon } from './CheckIcon'

export type ControlProps = {
  label?: string
  prependLabel?: boolean
  disabled?: boolean
  checked?: boolean
  onChange?: () => void
  containerStyles?: CSSProperties
}

const Icon = styled(CheckIcon)<{ checked?: boolean; disabled?: boolean }>((props) => ({
  visibility: props.checked && !props.disabled ? 'visible' : 'hidden',
}))

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenInput = styled.input(
  {
    border: 0,
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    width: 1,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  (props) => ({
    '&:focus + *': {
      border: `2px solid ${props.theme.colors.gray900}`,
    },
  }),
)

const ControlContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const ControlLabel = styled.div<{ disabled?: boolean }>(
  {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
  },
  (props) => ({
    fontFamily: props.theme.fonts.body,
    color: props.disabled ? props.theme.colors.gray500 : props.theme.colors.gray900,
  }),
)

const StyledCheckbox = styled.div<{
  checked?: boolean
  disabled?: boolean
}>(
  {
    position: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    margin: 6,
    borderRadius: 2,
    boxSizing: 'border-box',
    transition: 'all 150ms',
  },
  (props) => ({
    background: props.disabled
      ? props.theme.colors.gray300
      : props.checked
      ? props.theme.colors.gray900
      : props.theme.colors.white,
    border:
      (!props.checked && !props.disabled && `1px solid ${props.theme.colors.gray500};`) ||
      'initial',
    '&:hover': {
      border: (!props.checked && `2px solid ${props.theme.colors.gray900};`) || 'initial',
    },
  }),
)

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
