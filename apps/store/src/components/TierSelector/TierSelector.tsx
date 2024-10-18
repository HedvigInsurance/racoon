import * as RadioGroup from '@radix-ui/react-radio-group'
import { clsx } from 'clsx'
import { type ReactNode, type ComponentProps } from 'react'
import { ChevronIcon } from 'ui/src/icons/Chevron'
import { Space, Text, theme } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import {
  root,
  trigger,
  triggerIcon,
  optionsList,
  optionsListItem,
  optionsListItemHeader,
  optionsListItemPrice,
  separator,
  footer,
} from './TierSelector.css'

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

type OptionsListProps = ComponentProps<typeof RadioGroup.Root>

export const OptionsList = ({ className, ...delegated }: OptionsListProps) => {
  return <RadioGroup.Root className={clsx(optionsList, className)} {...delegated} />
}

type OptionsListItemProps = ComponentProps<typeof RadioGroup.Item> & {
  title: string
  price: string
  description?: string
}

export const OptionsListItem = ({
  className,
  title,
  price,
  description,
  ...delegated
}: OptionsListItemProps) => {
  return (
    <RadioGroup.Item className={clsx(optionsListItem, className)} {...delegated}>
      <Space y={0.5}>
        <div className={optionsListItemHeader}>
          <Text>{title}</Text>
          <Text className={optionsListItemPrice} color="textSecondary">
            {price}
          </Text>
        </div>
        {description && (
          <Text color="textSecondary" size="xs">
            {description}
          </Text>
        )}
      </Space>
    </RadioGroup.Item>
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
