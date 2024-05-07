import { clsx } from 'clsx'
import { type ReactNode, type ComponentProps } from 'react'
import { ChevronIcon, theme } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { root, trigger, triggerIcon, separator, footer } from './TierSelector.css'

type RootProps = ComponentProps<typeof Collapsible.Root>

export const Root = ({ className, ...delegated }: RootProps) => {
  return <Collapsible.Root className={clsx(root, className)} {...delegated} />
}

type HeaderProps = ComponentProps<typeof Collapsible.Trigger>

export const Header = ({ className, children, ...delegated }: HeaderProps) => {
  return (
    <Collapsible.Trigger className={clsx(trigger, className)} {...delegated}>
      {children}
      <ChevronIcon className={triggerIcon} size={theme.space.md} />
    </Collapsible.Trigger>
  )
}

type ContentProps = ComponentProps<typeof Collapsible.Content>

export const Content = ({ children, ...delegated }: ContentProps) => {
  return (
    <Collapsible.Content {...delegated}>
      <Separator />
      {children}
    </Collapsible.Content>
  )
}

export const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Separator />
      <div className={footer}>{children}</div>
    </>
  )
}

const Separator = () => <hr className={separator} />
