import styled from '@emotion/styled'
import { CheckIcon } from './CheckIcon'

export type CheckboxProps = {
  label?: React.ReactNode
  prependLabel?: boolean
  onChange?: () => void
  checked?: boolean
  disabled?: boolean
  circle?: boolean
}

const Icon = styled(CheckIcon)<CheckboxProps>((props) => ({
  marginTop: '1.5px',
  visibility: props.checked && !props.disabled ? 'visible' : 'hidden',
}))

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const HiddenInput = styled.input(
  {
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
    fontSize: '0.875rem',
    lineHeight: 1.25,
  },
  (props) => ({
    fontFamily: props.theme.fonts.body,
    color: props.disabled ? props.theme.colors.gray500 : props.theme.colors.gray900,
  }),
)

export const StyledCheckbox = ({ checked, onChange, disabled, circle }: CheckboxProps) => {
  return (
    <StyledCheckboxElement {...{ checked, onClick: onChange, disabled, circle }}>
      <DisabledTick disabled={disabled} />
      <Icon disabled={disabled} checked={checked} />
    </StyledCheckboxElement>
  )
}

const StyledCheckboxElement = styled.div<CheckboxProps>(
  ({ circle }: CheckboxProps) => ({
    position: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1.25rem',
    height: '1.25rem',
    margin: '0.4rem',
    borderRadius: circle ? '100%' : '2px',
    boxSizing: 'border-box',
    transition: 'all 150ms',
  }),
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

export const Checkbox = ({ disabled, checked, onChange, label, prependLabel }: CheckboxProps) => (
  <ControlContainer>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledCheckbox {...{ checked, onChange, disabled }} />
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </ControlContainer>
)
