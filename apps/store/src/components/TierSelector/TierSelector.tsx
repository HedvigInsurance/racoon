import * as Collapsible from '@radix-ui/react-collapsible'
import { type ReactNode } from 'react'
import { ChevronIcon, theme } from 'ui'
import {
  root,
  trigger,
  triggerBody,
  triggerIcon,
  content,
  separator,
  footer,
} from './TierSelector.css'

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
    <Collapsible.Content className={content}>
      <hr className={separator} />
      {children}
    </Collapsible.Content>
  )
}

export const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <hr className={separator} />
      <div className={footer}>{children}</div>
    </>
  )
}
