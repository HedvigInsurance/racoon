import { useState } from 'react'
import { Button, ButtonProps } from '../Button/Button'

export type ToggleButtonProps = Omit<ButtonProps, 'onClick'> & {
  initialActive?: boolean
  children?: React.ReactNode
  onToggle?: (isActive: boolean) => void
}

export const ToggleButton = ({
  children,
  initialActive,
  onToggle,
  ...props
}: ToggleButtonProps) => {
  const [isActive, setIsActive] = useState(Boolean(initialActive))

  const handleClick = () => {
    onToggle?.(!isActive)
    setIsActive((current) => !current)
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  )
}
