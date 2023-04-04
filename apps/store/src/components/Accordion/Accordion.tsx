import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import { forwardRef, PropsWithChildren, ReactElement } from 'react'
import { MinusIcon, mq, PlusIcon, theme } from 'ui'

export const Root = styled(AccordionPrimitives.Root)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,

  [mq.lg]: {
    gap: theme.space.xs,
  },
})

const Trigger = styled(AccordionPrimitives.Trigger)({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  fontSize: theme.fontSizes.md,

  [mq.lg]: {
    fontSize: theme.fontSizes.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      cursor: 'pointer',
    },
  },
})

export const Item = styled(AccordionPrimitives.Item)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,

  [mq.lg]: {
    paddingInline: theme.space.lg,
    paddingBlock: theme.space.md,
  },

  '@media (hover: hover)': {
    [`:has(${Trigger}:hover)`]: {
      backgroundColor: theme.colors.gray200,
      transition: `background ${theme.transitions.hover}`,
    },
  },
})

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
}

export const HeaderWithTrigger = ({ children }: HeaderWithTriggerProps) => {
  return (
    <AccordionPrimitives.Header>
      <Trigger>
        {children}

        <OpenIcon size="1rem" />
        <CloseIcon size="1rem" />
      </Trigger>
    </AccordionPrimitives.Header>
  )
}

const OpenIcon = styled(PlusIcon)({
  flexShrink: 0,
  display: 'block',
  '[data-state=open] &': { display: 'none' },
})

const CloseIcon = styled(MinusIcon)({
  flexShrink: 0,
  display: 'none',
  '[data-state=open] &': { display: 'block' },
})

type ContentProps = AccordionPrimitives.AccordionContentProps & { opened: boolean }

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, opened, ...props }, forwardedRef) => {
    return (
      <StyledContent {...props} ref={forwardedRef} forceMount>
        <motion.div
          initial={opened ? 'opened' : 'closed'}
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
          animate={opened ? 'opened' : 'closed'}
        >
          {children}
        </motion.div>
      </StyledContent>
    )
  },
)
Content.displayName = 'AccordionContent'

const StyledContent = styled(AccordionPrimitives.Content)({
  fontSize: theme.fontSizes.md,
  color: theme.colors.textSecondary,
  lineHeight: 1.32,
  overflow: 'hidden',
})
