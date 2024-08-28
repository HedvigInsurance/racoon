'use client'

import styled from '@emotion/styled'
import { useState } from 'react'
import * as React from 'react'
import chroma from 'chroma-js'
import { keyframes } from '@emotion/react'

const PopoverWrapper = styled.div<{ zIndex: number }>`
  display: inline-flex;
  position: relative;
`

const toTop = keyframes`
  0% {
    opacity: 0;
    bottom: 50%;
  }
  75% {
    opacity: 1;
    bottom: 105%;
  }
  100% {
    bottom: 100%;
  }
`
const toRight = keyframes`
  0% {
    opacity: 0;
    left: 50%;
  }
  75% {
    opacity: 1;
    left: 105%;
  }
  100% {
    left: 100%;
  }
`
const toBottom = keyframes`
  0% {
    opacity: 0;
    top: 50%;
  }
  75% {
    opacity: 1;
    top: 105%;
  }
  100% {
    top: 100%;
  }
`
const toLeft = keyframes`
  0% {
    opacity: 0;
    right: 50%;
  }
  75% {
    opacity: 1;
    right: 105%;
  }
  100% {
    right: 100%;
  }
`

const Contents = styled.div`
  text-align: center;
  position: absolute;
  max-width: 12rem;
  width: max-content;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: ${({ theme }) => theme.fontSize.small};
  white-space: pre-wrap;
  z-index: 100;

  background-color: ${({ theme }) => theme.semiStrongForeground};
  color: ${({ theme }) =>
    chroma(theme.placeholderColor).brighten(0.6).hex()} !important;

  &.top {
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -0.75rem);
    animation: ${toTop} 300ms;
  }

  &.right {
    top: 50%;
    left: 100%;
    transform: translate(0.75rem, -50%);
    animation: ${toRight} 300ms;
  }

  &.bottom {
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0.75rem);
    animation: ${toBottom} 300ms;
  }

  &.left {
    top: 50%;
    right: 100%;
    transform: translate(-0.75rem, -50%);
    animation: ${toLeft} 300ms;
  }
`

type Position = 'top' | 'right' | 'bottom' | 'left'

const Triangle = styled.div`
  position: absolute;
  z-index: 10;
  width: 0;
  height: 0;

  &.top {
    left: 50%;
    bottom: 1px;
    transform: translate(-50%, 100%);
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid ${({ theme }) => theme.semiStrongForeground};
  }

  &.right {
    top: 50%;
    left: 1px;
    transform: translate(-100%, -50%);
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
    border-right: 0.5rem solid ${({ theme }) => theme.semiStrongForeground};
  }

  &.bottom {
    left: 50%;
    top: 1px;
    transform: translate(-50%, -100%);
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid ${({ theme }) => theme.semiStrongForeground};
  }

  &.left {
    top: 50%;
    right: 1px;
    transform: translate(100%, -50%);
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
    border-left: 0.5rem solid ${({ theme }) => theme.semiStrongForeground};
  }
`

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  contents?: React.ReactNode
  position?: Position
  className?: string
  disable?: boolean
  onOpen?: () => void
  onClose?: () => void
  zIndex?: number
}

export const Popover: React.FC<PopoverProps> = ({
  contents,
  position = 'top',
  className,
  disable,
  onOpen,
  onClose,
  children,
  zIndex = 10,
  ...props
}) => {
  const [show, setShow] = useState(false)
  return (
    <PopoverWrapper className={className} zIndex={zIndex}>
      {show && contents && (
        <Contents className={position} {...props}>
          {contents}
          <Triangle className={position} />
        </Contents>
      )}
      <div
        onMouseOver={() => {
          if (disable) return
          setShow(true)
          onOpen?.()
        }}
        onMouseLeave={() => {
          if (disable) return
          setShow(false)
          onClose?.()
        }}
      >
        {children}
      </div>
    </PopoverWrapper>
  )
}
