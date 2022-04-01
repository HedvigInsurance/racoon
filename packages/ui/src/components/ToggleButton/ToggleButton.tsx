import { useState } from 'react'
import { Button, ButtonProps } from '../Button/button'

export type ToggleButtonProps = ButtonProps & {
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
