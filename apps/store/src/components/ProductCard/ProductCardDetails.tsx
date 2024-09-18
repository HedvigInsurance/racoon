import { type ComponentProps, createContext, type ReactNode, useContext, useState } from 'react'
import { Button } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'

type ContextValue = {
  isOpen: boolean
  toggle: () => void
}

const Context = createContext<ContextValue | null>(null)

const useProductDetails = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useProductDetails must be used inside ProductCardDetails')
  }

  return context
}

type RootProps = ComponentProps<typeof Collapsible.Root>
const Root = ({ children, ...props }: RootProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  return (
    <Collapsible.Root {...props} open={isOpen}>
      <Context.Provider value={{ isOpen, toggle }}>{children}</Context.Provider>
    </Collapsible.Root>
  )
}

type TriggerProps = Omit<ComponentProps<typeof Collapsible.Trigger>, 'children'> & {
  children?: ((isOpen: boolean) => ReactNode) | ReactNode
}
const Trigger = ({ children, ...props }: TriggerProps) => {
  const { isOpen, toggle } = useProductDetails()

  return (
    <Collapsible.Trigger asChild {...props}>
      <Button variant="outline" size="medium" onClick={toggle} fullWidth>
        {typeof children === 'function' ? children(isOpen) : children}
      </Button>
    </Collapsible.Trigger>
  )
}

type ContentProps = ComponentProps<'div'>
const Content = ({ children, ...props }: ContentProps) => {
  return (
    <Collapsible.Content>
      {/* This `div` wraps all content not to conflict with `Collapsible.Content` animation */}
      <div {...props}>{children}</div>
    </Collapsible.Content>
  )
}

export const ProductCardDetails = {
  Root,
  Trigger,
  Content,
}
