'use client'

import { useRef } from 'react'
import styled from '@emotion/styled'
import { Keys, Portal, useClickOutside, useKeyIsPressed } from '@hedvig-ui'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'

const getPosition = (
  firstCondition: 'top' | 'bottom' | 'left' | 'right',
  secondCondition: 'top' | 'bottom' | 'left' | 'right',
  position?: string,
) =>
  position === firstCondition
    ? 'flex-start'
    : position === secondCondition
      ? 'flex-end'
      : 'center'

const Wrapper = styled(motion.div)<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  background: string | null
}>`
  background-color: ${({ theme, background }) =>
    background ?? theme.backgroundTransparent};

  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  display: flex;
  align-items: ${({ position }) => getPosition('top', 'bottom', position)};
  justify-content: ${({ side }) => getPosition('left', 'right', side)};

  padding: 3rem;
`

const Container = styled(motion.div, {
  shouldForwardProp: (propName) => propName !== 'visible',
})`
  max-width: 100%;
  max-height: 100%;

  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};
  border-radius: 12px;

  background: ${({ theme }) => theme.background};
`

export interface ModalAdditionalOptions {
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  nodimbg?: boolean
}

export interface ModalProps extends HTMLMotionProps<'div'> {
  onClose: () => void
  options?: ModalAdditionalOptions
  disableClickOutside?: boolean
  visible: boolean
  disableDimBg?: boolean
  forceOverlay?: boolean
}

export const Modal = (props: ModalProps) => {
  if (!props.visible) {
    return null
  }

  return (
    <Portal>
      <ModalContent {...props} />
    </Portal>
  )
}

const ModalContent = ({
  onClose,
  children,
  options,
  disableClickOutside,
  disableDimBg,
  forceOverlay,
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const clickOutsideCloseHandler = () => !disableClickOutside && onClose()

  useClickOutside(modalRef, clickOutsideCloseHandler)
  useKeyIsPressed(Keys.Escape, (e) => {
    const targetTagName = (e.target as HTMLElement).nodeName
    const isFlagged = (e.target as HTMLElement).dataset.skipModalClose

    const shouldSkipClosingModal =
      isFlagged || ['INPUT', 'TEXTAREA'].includes(targetTagName)

    if (shouldSkipClosingModal) {
      return
    }

    onClose()
  })

  return (
    <AnimatePresence>
      <Wrapper
        key="modal-wrapper"
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        background={disableDimBg ? 'none' : null}
        style={forceOverlay ? { zIndex: '999' } : {}}
        {...options}
      >
        <Container
          ref={modalRef}
          key="modal"
          initial={{ opacity: 0, y: '-10%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-10%' }}
          {...props}
        >
          {children}
        </Container>
      </Wrapper>
    </AnimatePresence>
  )
}
