import styled from '@emotion/styled'
import { CheckIcon } from './CheckIcon'

type ControlStateProps = { checked?: boolean; disabled?: boolean }

export type ControlProps = {
  label?: string
  prependLabel?: boolean
  onChange?: () => void
} & ControlStateProps

const Icon = styled(CheckIcon)<ControlStateProps>((props) => ({
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

const StyledCheckbox = styled.div<ControlStateProps>(
  {
    position: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1.25rem',
    height: '1.25rem',
    margin: '0.4rem',
    borderRadius: '2px',
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

export const Checkbox = ({ disabled, checked, onChange, label, prependLabel }: ControlProps) => (
  <ControlContainer>
    {prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
    <HiddenInput {...{ checked, onChange, disabled }} type="checkbox" />
    <StyledCheckbox {...{ checked, onClick: onChange, disabled }}>
      <DisabledTick disabled={disabled} />
      <Icon disabled={disabled} checked={checked} />
    </StyledCheckbox>
    {!prependLabel && <ControlLabel disabled={disabled}>{label}</ControlLabel>}
  </ControlContainer>
)
