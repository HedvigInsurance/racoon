import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { type ComponentProps } from 'react'
import { CrossIcon } from '../../icons'
import { framerTransitions } from '../../theme'
import { IconButton } from '../Button/IconButton'
import { Card } from '../Card/Card'
import { Heading } from '../Heading/Heading'
import * as Dialog from './Dialog'
import { card, closeButton, content, heading, scrollableInnerContent } from './LargeDialog.css'

// Large modal, full-screen on mobile. Uses `Root` and `Trigger` from default `Dialog`
function Content({
  children,
  centerContent = true,
  className,
  frostedOverlay = true,
  ...forwardedProps
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Content
      centerContent={centerContent}
      className={clsx(content, className)}
      frostedOverlay={frostedOverlay}
      {...forwardedProps}
    >
      <MotionCard
        className={card}
        initial={{ opacity: 0, y: '2vh' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...framerTransitions.easeInOutCubic,
          duration: framerTransitions.defaultDuration,
        }}
      >
        <Dialog.Close asChild>
          <IconButton variant="secondary" Icon={<CrossIcon />} className={closeButton} />
        </Dialog.Close>
        {children}
      </MotionCard>
    </Dialog.Content>
  )
}

const MotionCard = motion(Card.Root)

function Header({ children, className, ...forwardedProps }: ComponentProps<typeof Heading>) {
  return (
    <Dialog.Title asChild>
      <Heading
        as="h2"
        variant="standard.24"
        className={clsx(heading, className)}
        {...forwardedProps}
      >
        {children}
      </Heading>
    </Dialog.Title>
  )
}

function ScrollableInnerContent({ children, className, ...forwardedProps }: ComponentProps<'div'>) {
  return (
    <div className={clsx(scrollableInnerContent, className)} {...forwardedProps}>
      {children}
    </div>
  )
}

export const LargeDialog = {
  Content,
  Header,
  ScrollableInnerContent,
}
