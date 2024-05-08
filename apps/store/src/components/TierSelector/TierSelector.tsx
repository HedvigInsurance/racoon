import { type ReactNode } from 'react'
import { ChevronIcon, theme } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { root, trigger, triggerBody, triggerIcon, separator, footer } from './TierSelector.css'

type RootProps = { children: ReactNode; defaultOpen?: boolean }

export const Root = ({ children, defaultOpen }: RootProps) => {
  return (
    <Collapsible.Root className={root} defaultOpen={defaultOpen}>
      {children}
    </Collapsible.Root>
  )
}

export const Header = ({ children }: { children: ReactNode }) => {
  return (
    <Collapsible.Trigger className={trigger}>
      <div className={triggerBody}>{children}</div>
      <ChevronIcon className={triggerIcon} size={theme.space.md} />
    </Collapsible.Trigger>
  )
}

export const Content = ({ children }: { children: ReactNode }) => {
  return (
    <Collapsible.Content>
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
