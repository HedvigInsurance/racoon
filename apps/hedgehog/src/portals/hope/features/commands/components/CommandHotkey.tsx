import * as React from 'react'
import { HotkeyHint, HotkeyHintProps } from '@hedvig-ui'
import { useCommandLine } from '../hooks/use-command-line'

interface CommandHotkeyProps extends HotkeyHintProps {
  onResolve?: () => void
}

export const CommandHotkey: React.FC<CommandHotkeyProps> = ({
  children,
  keys,
  text,
  onResolve,
  disabled,
  ...props
}) => {
  const { registerActions } = useCommandLine()

  registerActions([
    {
      label: text,
      keys,
      onResolve: () => {
        !disabled && onResolve?.()
      },
    },
  ])

  return (
    <HotkeyHint keys={keys} text={text} disabled={disabled} {...props}>
      {children}
    </HotkeyHint>
  )
}
