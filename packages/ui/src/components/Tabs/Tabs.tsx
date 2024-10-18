import * as RadixTabs from '@radix-ui/react-tabs'
import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { Button } from '../Button/Button'
import type { ButtonSize } from '../Button/Button.helpers'
import { tabButton, tabsListBase, tabsListSize, tabsListType, tabsRoot } from './Tabs.css'

const Root = ({ ...forwardedProps }: ComponentProps<typeof RadixTabs.Root>) => {
  return <RadixTabs.Root {...forwardedProps} className={tabsRoot} />
}

type ListProps = {
  size?: 'small' | 'medium' | 'large'
  type: 'default' | 'filled'
} & ComponentProps<typeof RadixTabs.List>

const List = ({ size = 'medium', type, ...forwardedProps }: ListProps) => {
  return (
    <RadixTabs.List
      {...forwardedProps}
      className={clsx(tabsListBase, tabsListSize[size], tabsListType[type])}
    />
  )
}

type TriggerProps = {
  size?: ButtonSize
} & ComponentProps<typeof RadixTabs.Trigger>

const Trigger = ({ children, size = 'medium', ...forwardedProps }: TriggerProps) => {
  return (
    <RadixTabs.Trigger {...forwardedProps} asChild={true}>
      <Button className={tabButton} variant="ghost" size={size}>
        {children}
      </Button>
    </RadixTabs.Trigger>
  )
}

export const Tabs = {
  Content: RadixTabs.Content,
  List,
  Root,
  Trigger,
}
