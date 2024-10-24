import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { ComponentProps, PropsWithChildren, ReactElement } from 'react'
import { forwardRef } from 'react'
import { MinusIcon } from 'ui/src/icons/MinusIcon'
import { PlusIcon } from 'ui/src/icons/PlusIcon'
import {
  closeIcon,
  content,
  item,
  openIcon,
  root,
  trigger,
  TRIGGER_ICON_SIZE,
} from './Accordion.css'

export const Root = ({
  className,
  ...forwardedProps
}: ComponentProps<typeof AccordionPrimitives.Root>) => (
  <AccordionPrimitives.Root className={clsx(root, className)} {...forwardedProps} />
)

export const Trigger = ({
  className,
  ...forwardedProps
}: ComponentProps<typeof AccordionPrimitives.Trigger>) => (
  <AccordionPrimitives.Trigger className={clsx(trigger, className)} {...forwardedProps} />
)

export const Item = ({
  className,
  ...forwardedProps
}: ComponentProps<typeof AccordionPrimitives.Item>) => (
  <AccordionPrimitives.Item className={clsx(item, className)} {...forwardedProps} />
)

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
  className?: string
}

export const HeaderWithTrigger = ({ children, className }: HeaderWithTriggerProps) => {
  return (
    <AccordionPrimitives.Header>
      <Trigger className={className}>
        {children}

        <PlusIcon size={TRIGGER_ICON_SIZE} className={openIcon} />
        <MinusIcon size={TRIGGER_ICON_SIZE} className={closeIcon} />
      </Trigger>
    </AccordionPrimitives.Header>
  )
}

type ContentProps = AccordionPrimitives.AccordionContentProps & { open: boolean }

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, open, className, ...props }, forwardedRef) => {
    return (
      <AccordionPrimitives.Content
        className={clsx(content, className)}
        {...props}
        ref={forwardedRef}
        forceMount={true}
      >
        <motion.div
          initial={open ? 'opened' : 'closed'}
          transition={{
            ease: [0.65, 0.05, 0.36, 1],
            duration: 0.4,
          }}
          variants={{
            opened: {
              height: 'var(--radix-accordion-content-height)',
            },
            closed: {
              height: 0,
            },
          }}
          animate={open ? 'opened' : 'closed'}
        >
          {children}
        </motion.div>
      </AccordionPrimitives.Content>
    )
  },
)
Content.displayName = 'AccordionContent'
