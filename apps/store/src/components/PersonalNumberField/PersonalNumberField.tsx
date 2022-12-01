import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import Personnummer from 'personnummer'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

enum AnimationState {
  Idle = 'IDLE',
  Active = 'ACTIVE',
}

/**
 * Personal Number input field.
 * Only supports Swedish personal numbers.
 */
export const PersonalNumberField = (props: Props) => {
  const theme = useTheme()
  const { value: propValue, defaultValue, ...baseProps } = props

  const [value, setValue] = useState(() => {
    if (typeof propValue === 'string') return propValue
    if (typeof defaultValue === 'string') return defaultValue
    return ''
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let value = event.target.value

    if (Personnummer.valid(value)) {
      value = Personnummer.parse(value).format(true)
    }
    setValue(value)
    setIsAnimating(true)
  }

  const animationVariants = {
    [AnimationState.Idle]: { backgroundColor: theme.colors.gray300 },
    [AnimationState.Active]: { backgroundColor: 'rgba(197, 236, 127, 0.6)' },
  } as const

  return (
    <>
      <input {...baseProps} type="text" value={value} readOnly hidden />

      <Input
        {...baseProps}
        type="text"
        name={undefined}
        inputMode="numeric"
        minLength={10}
        maxLength={13}
        pattern="[0-9-+]"
        onChange={handleOnChange}
        variants={animationVariants}
        initial={AnimationState.Idle}
        animate={isAnimating ? AnimationState.Active : AnimationState.Idle}
        onAnimationComplete={() => setIsAnimating(false)}
      />
    </>
  )
}

const Input = styled(motion.input)(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  padding: theme.space[4],
  borderRadius: theme.radius.sm,
  width: '100%',

  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[3],
}))
