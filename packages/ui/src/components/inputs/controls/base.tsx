import styled from '@emotion/styled'
import { CheckIcon } from '../../../icons/check-mark'

export type ControlProps = {
  label?: string
  prependLabel?: boolean
  disabled?: boolean
  checked?: boolean
  onChange?: () => void
}

export const Icon = styled(CheckIcon)<{ checked?: boolean; disabled?: boolean }>((props) => ({
  visibility: props.checked && !props.disabled ? 'visible' : 'hidden',
  marginTop: '1.5px',
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

export const ControlContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const ControlLabel = styled.div<{ disabled?: boolean }>(
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

export const StyledCheckbox = styled.div<{
  checked?: boolean
  disabled?: boolean
}>(
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
