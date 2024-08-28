'use client'

import {
  Flex,
  Keys,
  Portal,
  ThirdLevelHeadline,
  useDoubleClickOutside,
  useKeyIsPressed,
} from '@hedvig-ui'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'

const show = (position: 'left' | 'right') => {
  if (position === 'left') {
    return keyframes`
  from {
    left: -50rem;
  }

  to {
    left: 0;
  }
`
  }
  return keyframes`
  from {
    right: -50rem;
  }

  to {
    right: 0;
  }
`
}

const hide = (position: 'left' | 'right') => {
  if (position === 'left') {
    return keyframes`
  from {
    left: 0;
  }

  to {
    left: -50rem;
  }
  `
  }

  return keyframes`
  from {
    right: 0;
  }

  to {
    right: -50rem;
  }
`
}

const Container = styled.div<{ closing: boolean; position: 'left' | 'right' }>`
  position: fixed;
  top: 0;

  ${({ position }) =>
    position === 'left'
      ? css`
          left: 0;
          transition: left 400ms;
        `
      : css`
          right: 0;
          transition: right 400ms;
        `}

  width: 50rem;
  height: 100vh;

  background-color: ${({ theme }) => theme.background};
  z-index: 10;

  box-shadow: 5px 0px 13px -1px rgba(34, 60, 80, 0.2);

  animation: ${({ closing, position }) =>
      closing ? hide(position) : show(position)}
    400ms;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 10px 15px 14px 15px;
  background-color: ${({ theme }) => theme.backgroundLight};

  & svg {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
`

export const SidebarModal: React.FC<
  PropsWithChildren & {
    title: string
    onClose: () => void
    headerChildren?: React.ReactNode
    position?: 'left' | 'right'
  }
> = ({ onClose, headerChildren, title, children, position = 'left' }) => {
  const [closing, setClosing] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)

  const smoothClosing = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 350)
  }, [onClose])

  useKeyIsPressed(Keys.Escape, smoothClosing)
  useDoubleClickOutside(panelRef, smoothClosing)

  return (
    <Portal>
      <Container
        closing={closing}
        position={position}
        ref={panelRef}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Header>
          <Flex justify="space-between" align="center">
            <ThirdLevelHeadline style={{ margin: 0 }}>
              {title}
            </ThirdLevelHeadline>
            <CloseIcon onClick={smoothClosing} />
          </Flex>
          {headerChildren}
        </Header>
        {children}
      </Container>
    </Portal>
  )
}
