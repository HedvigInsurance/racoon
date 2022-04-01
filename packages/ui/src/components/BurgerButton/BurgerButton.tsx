import styled from '@emotion/styled'
import { useState } from 'react'
import { getColor, theme } from '../../lib/theme'
import { ToggleButton } from '../ToggleButton/ToggleButton'

const BURGER_LINE_WIDTH = '1.5rem'
const TRANSITION_TIME = 300

type BurgerButtonColors = 'dark' | 'light'

type AnimatedToggleButtonProps = {
  isActive: boolean
  color?: BurgerButtonColors
}

const CrossBurger = styled.div<AnimatedToggleButtonProps>(({ isActive, color }) => ({
  '&::before, &::after': {
    position: 'absolute',
    left: 0,
    right: 0,
    content: '" "',
    width: BURGER_LINE_WIDTH,
    height: 2,
    backgroundColor: getColor(color),
    transition: `background-color ${TRANSITION_TIME}ms, transform ${TRANSITION_TIME}ms, top ${TRANSITION_TIME}ms, bottom ${TRANSITION_TIME}ms`,
  },

  '&::before': {
    top: 2,
    ...(isActive
      ? {
          transform: 'translateY(-1px) rotate(45deg)',
          top: '50%',
          backgroundColor: getColor(color),
        }
      : {}),
  },
  '&::after': {
    bottom: 2,
    ...(isActive
      ? {
          bottom: '50%',
          transform: 'translateY(1px) rotate(-45deg)',
          backgroundColor: getColor(color),
        }
      : {}),
  },
}))

const MiddleBurger = styled.div<AnimatedToggleButtonProps>(({ isActive, color }) => ({
  width: BURGER_LINE_WIDTH,
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: isActive ? getColor(color) : 'transparent',
  transition: `background-color ${TRANSITION_TIME}ms`,
  transform: 'translateY(-1px)',
}))

const IconWrapper = styled.div({
  position: 'relative',
  width: BURGER_LINE_WIDTH,
  height: BURGER_LINE_WIDTH,
})

export type BurgerButtonProps = {
  onClick?: (isOpen: boolean) => void
  color?: BurgerButtonColors
}

export const BurgerButton = ({ color = 'dark', onClick }: BurgerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((current) => !current)

    if (onClick) onClick(!isOpen)
  }

  return (
    <ToggleButton
      onToggle={handleToggle}
      $size="sm"
      $variant="text"
      icon={
        <IconWrapper>
          <CrossBurger isActive={isOpen} color={color} />
          <MiddleBurger isActive={!isOpen} color={color} />
        </IconWrapper>
      }
    />
  )
}
