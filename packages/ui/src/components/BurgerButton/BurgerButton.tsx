import styled from '@emotion/styled'
import { useState } from 'react'
import { getColor } from '../../lib/theme/theme'
import { ButtonProps } from '../Button/Button'
import { ToggleButton } from '../ToggleButton/ToggleButton'

const BURGER_LINE_WIDTH = '1.5rem'
const TRANSITION_TIME = 300

type BurgerButtonColors = 'dark' | 'light'

type AnimatedToggleButtonProps = {
  isActive: boolean
  color?: BurgerButtonColors
}

const CrossBurger = styled.div<AnimatedToggleButtonProps>(({ isActive, color }) => {
  const backgroundColor = color ? getColor(color) : 'currentColor'

  return {
    '&::before, &::after': {
      position: 'absolute',
      left: 0,
      right: 0,
      content: '" "',
      width: BURGER_LINE_WIDTH,
      height: 2,
      backgroundColor,
      transition: `background-color ${TRANSITION_TIME}ms, transform ${TRANSITION_TIME}ms, top ${TRANSITION_TIME}ms, bottom ${TRANSITION_TIME}ms`,
    },

    '&::before': {
      top: 2,
      ...(isActive && {
        transform: 'translateY(-1px) rotate(45deg)',
        top: '50%',
        backgroundColor,
      }),
    },
    '&::after': {
      bottom: 2,
      ...(isActive && {
        bottom: '50%',
        transform: 'translateY(1px) rotate(-45deg)',
        backgroundColor,
      }),
    },
  }
})

const MiddleBurger = styled.div<AnimatedToggleButtonProps>(({ isActive, color }) => ({
  width: BURGER_LINE_WIDTH,
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: isActive ? (color ? getColor(color) : 'currentcolor') : 'transparent',
  transition: `background-color ${TRANSITION_TIME}ms`,
  transform: 'translateY(-1px)',
}))

const IconWrapper = styled.div({
  position: 'relative',
  width: BURGER_LINE_WIDTH,
  height: BURGER_LINE_WIDTH,
})

export type BurgerButtonProps = Pick<ButtonProps, 'color'> & {
  onClick?: (isOpen: boolean) => void
  color?: BurgerButtonColors
  initialOpen?: boolean
}

export const BurgerButton = ({
  color = 'dark',
  onClick,
  initialOpen = false,
}: BurgerButtonProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const handleToggle = () => {
    setIsOpen((current) => !current)

    if (onClick) onClick(!isOpen)
  }

  return (
    <ToggleButton
      onToggle={handleToggle}
      size="sm"
      variant="text"
      icon={
        <IconWrapper>
          <CrossBurger isActive={isOpen} color={color} />
          <MiddleBurger isActive={!isOpen} color={color} />
        </IconWrapper>
      }
    />
  )
}
