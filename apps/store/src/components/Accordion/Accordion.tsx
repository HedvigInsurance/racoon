import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import type { PropsWithChildren, ReactElement } from 'react';
import { forwardRef } from 'react'
import { MinusIcon, mq, PlusIcon, theme } from 'ui'

export const Root = styled(AccordionPrimitives.Root)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,

  [mq.lg]: {
    gap: theme.space.xs,
  },
})

export const Trigger = styled(AccordionPrimitives.Trigger)({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.md,
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.md,
  fontSize: theme.fontSizes.md,

  [mq.lg]: {
    fontSize: theme.fontSizes.lg,
    paddingBlock: theme.space.md,
    paddingInline: theme.space.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      cursor: 'pointer',
    },
  },

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.radius.sm,
  },
})

export const Item = styled(AccordionPrimitives.Item)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,

  '@media (hover: hover)': {
    [`:has(${Trigger}:hover)`]: {
      backgroundColor: theme.colors.gray200,
      transition: `background ${theme.transitions.hover}`,
    },
  },
})

const OPEN_CLOSE_ICON_SIZE = '1rem'

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
}

export const HeaderWithTrigger = ({ children }: HeaderWithTriggerProps) => {
  return (
    <AccordionPrimitives.Header>
      <Trigger>
        {children}

        <OpenIcon size={OPEN_CLOSE_ICON_SIZE} />
        <CloseIcon size={OPEN_CLOSE_ICON_SIZE} />
      </Trigger>
    </AccordionPrimitives.Header>
  )
}

const OpenIcon = styled(PlusIcon)({
  flexShrink: 0,
  display: 'block',
  '[data-state=open] > &': { display: 'none' },
})

const CloseIcon = styled(MinusIcon)({
  flexShrink: 0,
  display: 'none',
  '[data-state=open] > &': { display: 'block' },
})

type ContentProps = AccordionPrimitives.AccordionContentProps & { open: boolean }

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, open, ...props }, forwardedRef) => {
    return (
      <StyledContent {...props} ref={forwardedRef} forceMount={true}>
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
      </StyledContent>
    )
  },
)
Content.displayName = 'AccordionContent'

const StyledContent = styled(AccordionPrimitives.Content)({
  fontSize: theme.fontSizes.md,
  color: theme.colors.textSecondaryOnGray,
  lineHeight: 1.32,
  overflow: 'hidden',
  paddingInline: theme.space.md,

  [mq.lg]: {
    paddingLeft: theme.space.lg,
    paddingRight: `calc(${theme.space.lg} + ${OPEN_CLOSE_ICON_SIZE})`,
  },
})
