import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler, FocusEventHandler, InputHTMLAttributes, useId, useState } from 'react'
import { ChevronIcon, Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'children'>
type Props = InputProps & {
  label: string
  value?: string
  defaultValue?: string
  children?: string
}

export const DateInput = (props: Props) => {
  const { label, children, onFocus, onBlur, onChange, value, defaultValue, ...inputProps } = props
  const [focused, setFocused] = useState(props.autoFocus ?? false)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const inputValue = value || internalValue
  const dateValue = convertToDate(inputValue)
  const identifier = useId()
  const formatter = useFormatter()
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    highlight()
    setInternalValue(event.target.value)
    onChange?.(event)
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <InputWrapper y={0.5} {...animationProps}>
      <CheckboxHeader>
        <StyledLabel htmlFor={identifier}>
          <Text as="span">{label}</Text>
        </StyledLabel>
        <StyledInput
          type="date"
          id={identifier}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleChange}
          {...inputProps}
        />
        {!focused && (
          <Floating>
            <SpaceFlex align="center" space={0.25}>
              <Text>{dateValue ? formatter.fromNow(dateValue) : inputValue}</Text>
              <IconWrapper>
                <ChevronIcon size="1rem" />
              </IconWrapper>
            </SpaceFlex>
          </Floating>
        )}
      </CheckboxHeader>
      {children && (
        <Text size="sm" color="textSecondary">
          {children}
        </Text>
      )}
    </InputWrapper>
  )
}

const InputWrapper = styled(motion(Space))({
  backgroundColor: theme.colors.gray100,
  padding: theme.space.md,
  borderRadius: theme.radius.sm,
  width: '100%',
})

const CheckboxHeader = styled.div({
  position: 'relative',
  display: 'flex',
  gap: theme.space.sm,
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledLabel = styled.label({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  flex: 1,
})

const Floating = styled.div({
  position: 'absolute',
  right: 0,
  pointerEvents: 'none',
  cursor: 'pointer',
})

const IconWrapper = styled.div({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledInput = styled.input({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.md,
  cursor: 'pointer',
  opacity: 0,

  ':focus, :focus-within': {
    opacity: 1,
  },

  WebkitAlignItems: 'center',
  '::-webkit-datetime-edit': {
    textAlign: 'right',
    paddingRight: theme.space.xxs,
  },
})
