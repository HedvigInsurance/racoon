import styled from '@emotion/styled'
import {
  useEffect,
  useRef,
  useId,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  ComponentPropsWithRef,
} from 'react'
import { CheckIcon } from '../../icons/CheckIcon'
import { theme } from '../../lib/theme/theme'

export interface CheckboxImperativeAPI {
  click: () => void
}

export type CheckboxProps = ComponentPropsWithRef<'input'> & {
  label?: ReactNode
  prependLabel?: boolean
  circle?: boolean
  errorMessage?: string
}

export const Checkbox = forwardRef<CheckboxImperativeAPI, CheckboxProps>(
  ({ circle, prependLabel, label, errorMessage, ...delegated }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const id = useId()

    useImperativeHandle(
      ref,
      () => ({
        click: () => inputRef.current?.click(),
      }),
      [],
    )

    const handleInvalid = () => {
      if (errorMessage) {
        inputRef.current?.setCustomValidity(errorMessage)
      }
    }

    useEffect(() => {
      inputRef.current?.setCustomValidity('')
    }, [delegated.required, delegated.checked])

    let LabelComponent: ReactNode = null
    if (label) {
      LabelComponent = (
        <ControlLabel htmlFor={delegated.id ?? id} disabled={delegated.disabled}>
          {label}
        </ControlLabel>
      )
    }

    return (
      <ControlContainer>
        {prependLabel && LabelComponent}
        <CheckboxWrapper>
          <HiddenInput
            ref={inputRef}
            id={delegated.id ?? id}
            type="checkbox"
            onInvalid={handleInvalid}
            {...delegated}
          />
          <StyledCheckboxElement circle={circle}>
            <Icon />
            <DisabledTick />
          </StyledCheckboxElement>
        </CheckboxWrapper>
        {!prependLabel && LabelComponent}
      </ControlContainer>
    )
  },
)

Checkbox.displayName = 'Checkbox'

const ControlContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  width: 'max-content',
})

const HiddenInput = styled.input({
  position: 'absolute',
  inset: 0,
  // Hide checkbox visually but remain accessible to screen readers.
  opacity: 0,
  // The input needs to cover all the presentational bit (StyledCheckbox) and being
  // rendered on top of it so it handles interactions (house click, etc)
  zIndex: 1,
  '&:enabled:hover': {
    cursor: 'pointer',
  },
})

const ControlLabel = styled.label<{ disabled?: boolean }>(
  {
    cursor: 'default',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: theme.fontSizes.xs,
    lineHeight: 1.25,
  },
  (props) => ({
    fontFamily: theme.fonts.body,
    color: props.disabled ? theme.colors.gray500 : theme.colors.textPrimary,
  }),
)

const Icon = styled(CheckIcon)({
  color: theme.colors.white,
  // Its appearance is controlled by StyledCheckboxElement
  visibility: 'hidden',
})

const DisabledTick = styled.div({
  position: 'absolute',
  // Its appearance is controlled by StyledCheckboxElement
  display: 'none',
  width: 10,
  height: 2,
  backgroundColor: theme.colors.gray500,
})

const StyledCheckboxElement = styled.div<CheckboxProps>(({ circle }) => ({
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.25rem',
  height: '1.25rem',
  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: circle ? '100%' : '2px',
  background: theme.colors.white,
  transition: 'all 150ms',
  // checked/unchecked backgorund
  [`${HiddenInput}:checked + &`]: {
    background: theme.colors.dark,
    border: `1px solid ${theme.colors.dark}`,
  },
  [`${HiddenInput}:disabled + &`]: {
    background: theme.colors.gray300,
  },
  // hover/focus-visible
  [`${HiddenInput}:enabled:hover + &, ${HiddenInput}:focus-visible + &`]: {
    border: `1px solid ${theme.colors.dark}`,
  },
  // checked/disabled icons
  [`${HiddenInput}:enabled${HiddenInput}:checked + & > ${Icon}`]: {
    visibility: 'revert',
  },
  [`${HiddenInput}:not(:enabled) + & > ${DisabledTick}`]: {
    display: 'revert',
  },
}))

const CheckboxWrapper = styled.div({
  position: 'relative',
  isolation: 'isolate',
})
