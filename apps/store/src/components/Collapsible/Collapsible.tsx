import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { clsx } from 'clsx'
import { trigger, content } from './Collapsible.css'

const Trigger = ({ className, ...delegated }: RadixCollapsible.CollapsibleTriggerProps) => {
  return <RadixCollapsible.Trigger className={clsx(trigger, className)} {...delegated} />
}

const Content = ({ className, ...delegated }: RadixCollapsible.CollapsibleContentProps) => {
  return <RadixCollapsible.Content className={clsx(content, className)} {...delegated} />
}

export default {
  Root: RadixCollapsible.Root,
  Trigger,
  Content,
}
