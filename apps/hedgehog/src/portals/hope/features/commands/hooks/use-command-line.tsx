import { isPressing, Key, Keys, useKeyIsPressed } from '@hedvig-ui'
import { PushShortcutUsed } from '@hope/features/tracking/utils/tags'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as React from 'react'
import { CommandLineModal } from '../components/CommandLineModal'

export interface CommandLineAction {
  label: string
  keys?: Key[]
  onResolve: () => void
}

interface CommandLineContextProps {
  registerActions: (newActions: CommandLineAction[]) => void
  isHintingOption: boolean
  isHintingControl: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: () => void 0,
  isHintingOption: false,
  isHintingControl: false,
})

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const commandLine = useRef<HTMLInputElement>(null)
  const [showCommandLine, setShowCommandLine] = useState(false)
  const actions = useRef<CommandLineAction[]>([])
  const actionKeyCodes = useRef<Key[][]>([])

  const isControlPressed = useKeyIsPressed(Keys.Control)
  const isOptionPressed = useKeyIsPressed(Keys.Option)

  const onKeyDownShowCommandLine = (e: KeyboardEvent) => {
    if (!isPressing(e, Keys.Space)) {
      return
    }
    // for MACOS
    if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      setShowCommandLine(true)
      // for WINDOWS
    } else if (e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      setShowCommandLine(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDownShowCommandLine)

    return () => {
      document.removeEventListener('keydown', onKeyDownShowCommandLine)
    }
  }, [])

  useKeyIsPressed(Keys.Escape, () => {
    setShowCommandLine(false)
  })

  const onMouseDown = (event: MouseEvent) => {
    if (
      commandLine.current &&
      event.target instanceof Node &&
      commandLine.current.contains(event.target)
    ) {
      return
    }
    setShowCommandLine(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  const useAddAction = (newActions: CommandLineAction[]) =>
    useEffect(() => {
      actions.current = [...newActions, ...actions.current]
      updateActionKeyCodes()
      return () => {
        newActions.forEach((newAction) => {
          removeAction(newAction.label)
        })
        updateActionKeyCodes()
      }
    }, [newActions])

  const removeAction = (label: string) => {
    actions.current = actions.current.filter((action) => action.label !== label)
  }

  const updateActionKeyCodes = () => {
    actionKeyCodes.current = actions.current.map(
      (action) => (action.keys && action.keys.map((key) => key)) || [],
    )
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (!(e.target instanceof Node)) {
      return
    }

    if (e.getModifierState && e.getModifierState(e.key)) {
      return
    }

    if (
      (e.target?.nodeName === 'INPUT' || e.target?.nodeName === 'TEXTAREA') &&
      e.code !== 'Escape' &&
      e.code !== 'Enter'
    ) {
      return
    }

    const matchIndex = actionKeyCodes.current.findIndex((keyCodes) => {
      return isPressing(e, keyCodes)
    })

    if (matchIndex > -1) {
      PushShortcutUsed(
        actions.current[matchIndex].label,
        actions.current[matchIndex].keys?.map((key) => key.code) ?? [],
      )

      actions.current[matchIndex].onResolve()
      setShowCommandLine(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, {
      capture: true,
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <CommandLineContext.Provider
      value={{
        registerActions: useAddAction,
        isHintingOption: isOptionPressed,
        isHintingControl: isControlPressed,
      }}
    >
      {children}
      {showCommandLine && (
        <div ref={commandLine}>
          <CommandLineModal
            hide={() => setShowCommandLine(false)}
            actions={actions.current}
          />
        </div>
      )}
    </CommandLineContext.Provider>
  )
}
