import styled from '@emotion/styled'
import { motion, type Transition } from 'framer-motion'
import { type ReactNode } from 'react'
import { CrossIcon, Dialog, mq, theme } from 'ui'

type Props = {
  children: ReactNode
  Header?: ReactNode
  Footer?: ReactNode
  center?: boolean
}

export const Modal = ({ children, Header, Footer, center = false }: Props) => {
  return (
    <Content frostedOverlay={true}>
      {Header === undefined ? (
        <ModalHeader>
          <CloseButton>
            <CrossIcon />
          </CloseButton>
        </ModalHeader>
      ) : (
        Header
      )}
      {center ? (
        <CenteredMain>
          <AnimateContentWrapper>{children}</AnimateContentWrapper>
        </CenteredMain>
      ) : (
        <Main>
          <ClearHeader />
          <AnimateContentWrapper>{children}</AnimateContentWrapper>
          <ClearFooter />
        </Main>
      )}
      {Footer && (
        <FooterWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={ANIMATE_TRANSITION}
        >
          {Footer}
        </FooterWrapper>
      )}
    </Content>
  )
}

const Content = styled(Dialog.Content)({
  height: '100%',
  overflowY: 'auto',
  isolation: 'isolate',
})

const HEADER_HEIGHT = '3.5rem'
const ModalHeader = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingInline: theme.space.md,
  height: HEADER_HEIGHT,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const CloseButton = styled(Dialog.Close)({ cursor: 'pointer' })

const Main = styled.main({
  display: 'flex',
  flexDirection: 'column',
})

const CenteredMain = styled(Main)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: theme.space.md,
})

const ClearHeader = styled.div({
  height: HEADER_HEIGHT,
})

const BUTTON_HEIGHT = '3.25rem'
const ClearFooter = styled.div({
  height: `calc(${BUTTON_HEIGHT} + ${theme.space.md} * 2)`,
  [mq.lg]: {
    height: `calc(${BUTTON_HEIGHT} + ${theme.space.xxl} * 2)`,
  },
})

const FooterWrapper = styled(motion.footer)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,

  display: 'grid',
  gridTemplateColumns: 'minmax(0, 24rem)',
  justifyContent: 'center',
  gap: theme.space.xxs,
  paddingInline: theme.space.md,
  paddingBottom: theme.space.md,

  [mq.lg]: {
    paddingBottom: theme.space.xxl,
  },
})

export const AnimateContentWrapper = ({ children }: { children: ReactNode }) => {
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

const ANIMATE_TRANSITION: Transition = {
  duration: 0.5,
  ...theme.transitions.framer.easeInOutCubic,
}
