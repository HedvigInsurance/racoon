import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { type ComponentProps } from 'react'
import { CrossIcon } from '../../icons'
import { framerTransitions } from '../../theme'
import { IconButton } from '../Button/IconButton'
import { Card } from '../Card/Card'
import { Heading } from '../Heading/Heading'
import * as Dialog from './Dialog'
import { card, closeButton, content, heading } from './LargeDialog.css'

// Large modal, full-screen on mobile
function Content({
  children,
  centerContent = true,
  className,
  ...forwardedProps
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Content
      centerContent={centerContent}
      className={clsx(content, className)}
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
          <IconButton Icon={<CrossIcon />} className={closeButton} />
        </Dialog.Close>
        {children}
      </MotionCard>
    </Dialog.Content>
  )
}

const MotionCard = motion.create(Card.Root)

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

export const LargeDialog = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content,
  Header,
}
