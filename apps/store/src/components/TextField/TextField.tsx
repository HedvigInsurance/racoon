import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import {
  ChangeEventHandler,
  InputHTMLAttributes,
  MouseEventHandler,
  useId,
  useRef,
  useState,
} from 'react'
import { CrossIconSmall, LockIcon, Space, Text, WarningTriangleIcon, theme } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onChange'
>

export type Props = BaseInputProps & {
  label: string
  variant?: 'small' | 'large'
  suffix?: string
  warning?: boolean
  message?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
}

export const TextField = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    defaultValue,
    label,
    variant = 'large',
    suffix,
    warning = false,
    message,
    id,
    onValueChange,
    onClear,
    ...inputProps
  } = props
  const [value, setValue] = useState(defaultValue || '')
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()
  const generatedId = useId()
  const identifier = id || generatedId

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value
    setValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClickDelete: MouseEventHandler<HTMLButtonElement> = () => {
    onClear?.()
    const newValue = ''
    setValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClickWrapper: MouseEventHandler<HTMLDivElement> = () => {
    inputRef.current?.focus()
  }

  const inputValue = inputProps.value || value

  const [Wrapper, InputWrapper, Input] =
    variant === 'large'
      ? ([LargeWrapper, LargeInputWrapper, LargeInput] as const)
      : ([SmallWrapper, SmallInputWrapper, SmallInput] as const)

  return (
    <Space y={0.25}>
      <Wrapper
        {...animationProps}
        data-active={!!inputValue}
        data-warning={warning}
        data-readonly={inputProps.readOnly ? '' : undefined}
        onClick={handleClickWrapper}
      >
        <Label htmlFor={identifier} data-disabled={inputProps.disabled} data-variant={variant}>
          {label}
        </Label>
        <InputWrapper>
          <Input
            {...inputProps}
            id={identifier}
            ref={inputRef}
            onKeyDown={highlight}
            onChange={handleChange}
            value={inputValue}
            aria-label={label}
          />
          {suffix && inputValue && (
            <Text as="span" size={variant === 'large' ? 'xl' : 'lg'} color="textSecondary">
              {suffix}
            </Text>
          )}

          {inputValue &&
            (inputProps.disabled ? (
              <LockIcon size="1rem" color={theme.colors.textSecondary} />
            ) : (
              <DeleteButton
                type="button"
                onClick={handleClickDelete}
                aria-hidden={true}
                // TODO: Get this lokalised
                aria-label="Clear field"
              >
                <CrossIconSmall />
              </DeleteButton>
            ))}
        </InputWrapper>
      </Wrapper>
      {message &&
        (warning ? (
          <MessageWithIcon size="sm">
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            {message}
          </MessageWithIcon>
        ) : (
          <MessageText size="sm">{message}</MessageText>
        ))}
    </Space>
  )
}

const warningAnimation = keyframes({
  '0%': {
    backgroundColor: theme.colors.amber100,
    color: theme.colors.signalAmberText,
  },
  '100%': {
    backgroundColor: theme.colors.translucent1,
    color: theme.colors.textPrimary,
  },
})

const warningColorAnimation = keyframes({
  '0%': {
    color: theme.colors.signalAmberText,
  },
  '100%': {
    color: theme.colors.textSecondary,
  },
})

const BaseWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
  width: '100%',
  cursor: 'text',

  '&[data-warning=true]': {
    animation: `${warningAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 1`,
  },
})

const LargeWrapper = styled(BaseWrapper)({ height: '4.5rem' })
const SmallWrapper = styled(BaseWrapper)({ height: '3.25rem' })

const Label = styled.label({
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textSecondary,

  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: 'translate(0, 0) scale(1)',
  paddingInline: theme.space.md,

  fontSize: theme.fontSizes.xl,
  '&[data-variant=small]': { fontSize: theme.fontSizes.lg },

  [`${LargeWrapper}:focus-within > &, ${LargeWrapper}[data-active=true] > &`]: {
    overflow: 'visible',
    transform: `translate(calc(${theme.space.md} * 0.4), -0.6rem) scale(0.6)`,
  },

  [`${SmallWrapper}:focus-within > &, ${SmallWrapper}[data-active=true] > &`]: {
    transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
  },

  [`${LargeWrapper}[data-warning=true] > &, ${SmallWrapper}[data-warning=true] > &`]: {
    animation: `${warningColorAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 1`,
  },

  '&&[data-disabled=true]': {
    color: theme.colors.textTertiary,
  },
})

const LargeInputWrapper = styled.div({
  position: 'absolute',
  bottom: '0.625rem',
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  paddingRight: theme.space.md,
})

const SmallInputWrapper = styled(LargeInputWrapper)({ bottom: '0.3125rem' })

const LargeInput = styled.input({
  width: '100%',
  fontSize: theme.fontSizes.xl,
  paddingLeft: theme.space.md,

  ':disabled, :read-only': {
    color: theme.colors.textSecondary,

    // Webkit overrides
    WebkitTextFillColor: theme.colors.textSecondary,
    opacity: 1,
  },
  ':disabled': {
    cursor: 'not-allowed',
  },
})

const SmallInput = styled(LargeInput)({ fontSize: theme.fontSizes.lg })

const MessageText = styled(Text)({
  paddingLeft: theme.space.md,
})

const MessageWithIcon = styled(Text)({
  paddingLeft: theme.space.xxs,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

const DeleteButton = styled.button({
  cursor: 'pointer',
  opacity: 0,

  ':focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },

  [`${LargeWrapper}:focus-within &, ${SmallWrapper}:focus-within &, ${LargeWrapper}[data-readonly] &, ${SmallWrapper}[data-readonly] &`]:
    {
      opacity: 1,
    },
})
