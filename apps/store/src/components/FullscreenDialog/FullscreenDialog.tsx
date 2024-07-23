import { motion, type Transition } from 'framer-motion'
import { type ReactNode } from 'react'
import { CrossIcon, Dialog, framerTransitions } from 'ui'
import {
  dialogCloseIcon,
  dialogContent,
  dialogFooterWrapper,
  dialogHeaderWrapper,
  dialogMain,
} from './FullscreenDialog.css'

type Props = {
  children: ReactNode
  Header?: ReactNode
  Footer?: ReactNode
  center?: boolean
}

export const Modal = ({ children, Header, Footer, center = false }: Props) => {
  return (
    <Dialog.Content className={dialogContent} frostedOverlay>
      {/* When not provided `Header` we display a fallback header. */}
      {/* Strict check for 'undefined' is desired so consumers can omit the header with Header={null} */}
      <header className={dialogHeaderWrapper}>
        {Header === undefined ? (
          <Dialog.Close className={dialogCloseIcon}>
            <CrossIcon />
          </Dialog.Close>
        ) : (
          Header
        )}
      </header>
      <main className={dialogMain[center ? 'centered' : 'regular']}>
        <AnimateContentWrapper>{children}</AnimateContentWrapper>
      </main>
      {Footer && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={ANIMATE_TRANSITION}
          className={dialogFooterWrapper}
        >
          {Footer}
        </motion.footer>
      )}
    </Dialog.Content>
  )
}

export function AnimateContentWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: '2vh',
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={ANIMATE_TRANSITION}
    >
      {children}
    </motion.div>
  )
}

export const Root = Dialog.Root
export const Close = Dialog.Close
export const Trigger = Dialog.Trigger
export const Title = Dialog.Title

const ANIMATE_TRANSITION: Transition = {
  duration: 0.5,
  ...framerTransitions.easeInOutCubic,
}
