'use client'

import styled from '@emotion/styled'
import { isPressing, Key, Keys, lightTheme } from '@hedvig-ui'
import chroma from 'chroma-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as React from 'react'
import { useClickOutside } from '../hooks/use-click-outside'
import { useRemindersCookies } from '../hooks/use-reminder'

interface NavigationDirections {
  up?: string | string[] | (() => string)
  down?: string | string[] | (() => string)
  left?: string | string[] | (() => string)
  right?: string | string[] | (() => string)
}

interface NavigationOptions {
  autoFocus?: boolean
  onNavigation?: (
    nextCursor: string,
    direction?: 'up' | 'down' | 'left' | 'right',
  ) => void
  focus?: Key | Key[]
  forceFocus?: boolean
  metaKey?: 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'
  resolve?: string | ((ref: unknown) => string | void)
  parent?: string | ((ref: unknown) => string | void)
  neighbors?: NavigationDirections
  ref?: unknown
  input?: boolean
  textarea?: boolean
  focusedActions?: {
    key: Key
    action: () => void
  }[]
  track?: boolean | number
}

interface NavigationContextProps {
  cursor: string | null
  setCursor: (name: string | null) => void
  registry: Record<string, NavigationOptions>
  registerItem: (name: string, options?: NavigationOptions) => void
  unregisterItem: (name: string) => void
  assignRef: (name: string, ref: unknown) => void
}

export const searchElementByTagName = (
  tagName: string,
  element?: Element | null,
): Element | null => {
  if (!element) {
    return null
  }

  if (element.tagName === tagName) {
    return element
  } else if (element.children != null) {
    let result = null

    for (let i = 0; result == null && i < element.children.length; i++) {
      result = searchElementByTagName(tagName, element.children.item(i))
    }

    return result
  }

  return null
}

const NavigationContext = createContext<NavigationContextProps>({
  cursor: null,
  setCursor: () => void 0,
  registry: {},
  registerItem: () => void 0,
  unregisterItem: () => void 0,
  assignRef: () => void 0,
})

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const registry = useRef<Record<string, NavigationOptions>>({})
  const cursorRef = useRef<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)

  const validate = (name: string) => {
    if (!registry.current[name]) {
      console.warn(`[useNavigation] No item with name '${name}' found`)
      return false
    }

    return true
  }

  const registerItem = useCallback(
    (name: string, options?: NavigationOptions) => {
      if (options && Object.keys(options).length !== 0) {
        registry.current[name] = options
      }
    },
    [],
  )

  const unregisterItem = useCallback((name: string) => {
    delete registry.current[name]
  }, [])

  const assignRef = useCallback((name: string, ref: unknown) => {
    if (!registry.current?.[name]?.ref) return
    if (!registry.current[name].ref) {
      registry.current[name].ref = ref
    }
  }, [])

  const handleCursorChange = useCallback((value: string | null) => {
    setCursor(value)
    cursorRef.current = value
  }, [])

  const getNextCursor = (target: string | string[] | (() => string)) => {
    return typeof target === 'function'
      ? target()
      : typeof target === 'object' &&
          target.find((item: string) => registry.current[item])
        ? (target.find((item: string) => registry.current[item]) as string)
        : typeof target !== 'object'
          ? target
          : ''
  }

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    const currentActiveElement = document.activeElement

    const isActiveElementInput =
      currentActiveElement?.nodeName === 'TEXTAREA' ||
      currentActiveElement?.nodeName === 'INPUT'

    if (isActiveElementInput && !isPressing(e, Keys.Escape)) {
      return
    }

    Object.keys(registry.current).some((name) => {
      const options = registry.current[name]

      if (!options?.focus) {
        return false
      }

      if (options?.focusedActions && name === cursorRef.current) {
        options.focusedActions.forEach((action) => {
          if (isPressing(e, action.key)) {
            action.action()
          }
        })

        return false
      }

      if (
        (options.metaKey ? e[options.metaKey] : true) &&
        isPressing(e, options.focus)
      ) {
        setCursor(name)
        cursorRef.current = name
      }

      return false
    })

    const target = cursorRef.current
      ? registry.current[cursorRef.current]
      : null

    if (!target) {
      return
    }

    if (isPressing(e, Keys.Enter)) {
      if ((target.input || target.textarea) && cursorRef.current) {
        const navElement = document.getElementById(cursorRef.current)

        const inputElement = searchElementByTagName(
          target.input ? 'INPUT' : 'TEXTAREA',
          navElement?.children.item(0),
        ) as unknown as HTMLElement

        // The reason of timeout is "Enter" action inside input on focus
        setTimeout(() => inputElement.focus())
      }

      if (!target.resolve) {
        return
      }

      if (typeof target.resolve === 'string') {
        if (!validate(target.resolve)) {
          return
        }

        setCursor(target.resolve)
        cursorRef.current = target.resolve
        return
      }

      const nextCursor = cursorRef.current
        ? (target.resolve(registry.current[cursorRef.current].ref) ?? null)
        : null

      if (nextCursor) {
        setCursor(nextCursor)
        cursorRef.current = nextCursor

        return
      }

      setCursor(null)
      cursorRef.current = null
    }

    if (isPressing(e, Keys.Escape)) {
      if (isActiveElementInput) {
        const element = document.activeElement as HTMLElement
        element?.blur()
        return
      }

      if (!target?.parent) {
        setCursor(null)
        cursorRef.current = null
        return
      }

      if (typeof target.parent === 'string') {
        setCursor(target.parent)
        cursorRef.current = target.parent
        return
      }

      const nextCursor = cursorRef.current
        ? target.parent(registry.current[cursorRef.current].ref)
        : null

      if (nextCursor) {
        setCursor(nextCursor)
        cursorRef.current = nextCursor
      }

      return
    }

    if (isPressing(e, Keys.Up) && target?.neighbors?.up) {
      e.preventDefault()

      const nextCursor: string = getNextCursor(target.neighbors.up)

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'up')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Down) && target?.neighbors?.down) {
      e.preventDefault()
      const nextCursor: string = getNextCursor(target.neighbors.down)

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'down')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Left) && target?.neighbors?.left) {
      e.preventDefault()
      const nextCursor: string = getNextCursor(target.neighbors.left)

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'left')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Right) && target?.neighbors?.right) {
      e.preventDefault()
      const nextCursor: string = getNextCursor(target.neighbors.right)

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'right')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  return (
    <NavigationContext.Provider
      value={{
        cursor,
        setCursor: handleCursorChange,
        registerItem,
        unregisterItem,
        registry: registry.current,
        assignRef,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export interface NavigationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  name: string
  options: NavigationOptions
  remindKeys?: Key[]
  navigateOnRender?: boolean
  style?: React.CSSProperties | ((focus: boolean) => React.CSSProperties)
}

const NavContainer = styled.div<{ focus: boolean }>`
  border: 1px solid ${({ focus }) => (focus ? 'blue' : 'transparent')};
`

export const Navigation: React.FC<NavigationProps> = ({
  name,
  options: {
    focus,
    autoFocus,
    onNavigation,
    forceFocus,
    parent,
    track,
    metaKey,
    resolve,
    neighbors,
    ref,
    input,
    textarea,
    focusedActions,
  },
  navigateOnRender,
  remindKeys,
  style,
  children,
  ...props
}) => {
  const {
    cursor,
    setCursor,
    registry,
    registerItem,
    unregisterItem,
    assignRef,
  } = useContext(NavigationContext)

  const [isFocus, setIsFocus] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerItem(name, {
      focus,
      autoFocus,
      onNavigation,
      forceFocus,
      parent,
      track,
      metaKey,
      resolve,
      neighbors,
      ref,
      input,
      textarea,
      focusedActions,
    })
    assignRef(name, navRef)

    if (navigateOnRender && onNavigation) {
      onNavigation(name)
    }

    if (forceFocus) {
      setCursor(name)
    }

    return () => {
      unregisterItem(name)
      setCursor(null)
    }
  }, [
    focus,
    autoFocus,
    onNavigation,
    forceFocus,
    parent,
    track,
    metaKey,
    resolve,
    neighbors,
    ref,
    input,
    textarea,
    focusedActions,
    assignRef,
    name,
    navigateOnRender,
    registerItem,
    setCursor,
    unregisterItem,
  ])

  useEffect(() => {
    if (autoFocus && !cursor) {
      setCursor(name)

      if (input || textarea) {
        const navElement = document.getElementById(name)

        const inputElement = searchElementByTagName(
          input ? 'INPUT' : 'TEXTAREA',
          navElement?.children.item(0),
        ) as HTMLElement

        // The reason of timeout is "Enter" action inside input on focus
        setTimeout(() => inputElement.focus())
      }
    }
  }, [cursor, autoFocus, registry, name, input, textarea, setCursor])

  useEffect(() => {
    if (cursor && cursor === name && navRef) {
      setIsFocus(true)
      const element = document.activeElement as HTMLElement
      element.blur()

      navRef.current?.focus()
      navRef.current?.scrollIntoView({
        inline: 'center',
        block: 'center',
        behavior: 'smooth',
      })

      return
    }

    setIsFocus(false)
    navRef.current?.blur()
  }, [cursor, name])

  useClickOutside(navRef, () => navRef.current?.blur())

  const { showReminder } = useRemindersCookies()

  const clickNavigationHandler = () => {
    const navigationArea = name.split('-')[0]

    if (!remindKeys) {
      return
    }

    showReminder(navigationArea, remindKeys)
  }

  return (
    <NavContainer
      id={name}
      ref={navRef}
      focus={isFocus}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Tab)) {
          setCursor(null)
        }
      }}
      onClick={async (e) => {
        clickNavigationHandler()
        props.onClick?.(e)

        const castedChild = children as React.ReactElement
        if (castedChild?.props.onClick) {
          await castedChild?.props?.onClick()
        }

        if (typeof resolve === 'string') {
          setCursor(resolve)
          return
        }

        if (typeof resolve !== 'function') {
          return
        }

        const nextCursor = resolve(name)

        if (nextCursor) {
          setCursor(nextCursor)
        }
      }}
      {...props}
      style={
        style && typeof style === 'function' ? style(isFocus) : (style ?? {})
      }
    >
      {children}
    </NavContainer>
  )
}

export const NavigationAbsoluteWrapper = styled(Navigation)`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
`

interface NavigationAbsoluteProps extends Omit<NavigationProps, 'style'> {
  disableBg?: boolean
  style?: React.CSSProperties
}

export const NavigationAbsolute: React.FC<NavigationAbsoluteProps> = ({
  disableBg,
  style,
  ...props
}) => (
  <NavigationAbsoluteWrapper
    style={(focus) => ({
      backgroundColor:
        focus && !disableBg
          ? chroma(lightTheme.background).alpha(0.3).hex()
          : 'transparent',
      ...style,
    })}
    {...props}
  />
)

export const useNavigation = () => {
  const {
    cursor,
    registry,
    setCursor,
    registerItem,
    unregisterItem,
    assignRef,
  } = useContext(NavigationContext)

  const localItems = useRef<Record<string, NavigationOptions>>({})

  const registerItemHandler = (name: string, options?: NavigationOptions) => {
    registerItem(name, options)

    if (options && Object.keys(options).length !== 0) {
      localItems.current[name] = options
    }
  }

  const targetTracking = Object.keys(localItems.current).find(
    (name) => localItems.current[name].track,
  )

  useEffect(() => {
    const currentLocalItems = localItems.current

    if (cursor) {
      return
    }

    Object.keys(currentLocalItems).forEach((name) => {
      if (!currentLocalItems[name]) return
      const { autoFocus, onNavigation } = currentLocalItems[name]

      if (!autoFocus) return

      if (onNavigation) {
        onNavigation(name)
      }

      setCursor(name)
      return
    })

    return () => {
      Object.keys(currentLocalItems).forEach((name) => {
        unregisterItem(name)
        delete currentLocalItems[name]
      })
    }
  }, [cursor, targetTracking, setCursor, unregisterItem])

  const itemExists = (name: string) => !!registry[name]

  const register = (
    name: string,
    options?: NavigationOptions,
    activeStyle?: React.CSSProperties,
    style?: React.CSSProperties,
  ) => {
    if (!itemExists(name)) {
      registerItemHandler(name, options)
    }

    if (cursor !== name) {
      return {
        style: {
          border: '2px solid transparent',
          ...style,
        },
        id: name,
      }
    }

    return {
      style: {
        border: `2px solid ${chroma(lightTheme.accent).brighten(1).hex()}`,
        ...activeStyle,
      },
      // eslint-disable-next-line
      ref: (ref: any) => {
        assignRef(name, ref)

        ref?.scrollIntoView({
          inline: 'center',
          block: 'center',
          behavior: 'smooth',
        })

        if (ref && ref.nodeName === 'INPUT') {
          return
        }

        ref?.focus()
      },
      id: name,
    }
  }

  return {
    register,
  }
}
