import styled from '@emotion/styled'
import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  Trigger: ReactNode
  children: ReactNode
}

export const Collapsible = (props: Props) => {
  return (
    <RadixCollapsible.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Trigger asChild={true}>{props.Trigger}</Trigger>
      <CollapsibleContent forceMount={true}>
        <motion.div
          initial={props.open ? 'open' : 'closed'}
          transition={{
            ease: [0.65, 0.05, 0.36, 1],
            duration: 0.4,
          }}
          variants={{
            open: {
              height: 'var(--radix-collapsible-content-height)',
            },
            closed: {
              height: 0,
            },
          }}
          animate={props.open ? 'open' : 'closed'}
        >
          {props.children}
        </motion.div>
      </CollapsibleContent>
    </RadixCollapsible.Root>
  )
}

const Trigger = styled(RadixCollapsible.Trigger)({
  cursor: 'pointer',
})

const CollapsibleContent = styled(RadixCollapsible.Content)({
  overflow: 'hidden',
  cursor: 'initial',
})
