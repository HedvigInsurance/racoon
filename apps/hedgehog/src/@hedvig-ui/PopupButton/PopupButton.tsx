'use client'

import { ReactNode, useState } from 'react'
import { Button } from '../Button/button'
import { Popover } from '../Popover/popover'
import styled from '@emotion/styled'

const PopupContainer = styled.div<{
  position: 'top' | 'bottom' | 'left' | 'right'
}>`
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'top':
        return `
          bottom: 100%;
        `
      case 'bottom':
        return `
          top: 100%;
        `
      case 'left':
        return `
          top: 0;
          right: 100%;
        `
      case 'right':
        return `
          top: 0;
          left: 100%;
        `
    }
  }}
  background-color: white;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;

  & > div {
    padding: ${({ theme }) => theme.spacing.fraction};
    min-width: max-content;
    border-radius: 0.5rem;
  }
`

type PopupButtonProps = {
  children: ReactNode
  text: string
  visible: boolean
  toggleVisible: () => void
  popover?: string
  togglePopover?: () => void
  disabled?: boolean
  icon?: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const PopupButton = ({
  children,
  text,
  visible,
  toggleVisible,
  popover,
  togglePopover,
  disabled,
  icon,
  position = 'top',
}: PopupButtonProps) => {
  return (
    <Popover contents={popover}>
      <Button
        size="small"
        variant={visible ? 'secondary' : 'tertiary'}
        disabled={disabled ?? false}
        icon={icon ?? undefined}
        onClick={(e) => {
          e.stopPropagation()
          togglePopover?.()
          toggleVisible()
        }}
      >
        {text}
      </Button>
      {visible && (
        <PopupContainer position={position}>{children}</PopupContainer>
      )}
    </Popover>
  )
}

type UsePopupButtonProps = {
  defaultPopover?: string
}

export const usePopupButton = ({
  defaultPopover,
}: UsePopupButtonProps = {}) => {
  const [popupVisible, setPopupVisible] = useState(false)
  const togglePopupVisible = () => {
    setPopupVisible((prev) => !prev)
  }

  const onClose = () => {
    setPopupVisible(false)
    setPopover(defaultPopover)
  }

  const [popover, setPopover] = useState<string | undefined>(defaultPopover)
  const togglePopover = () => {
    setPopover((prev) => {
      if (!prev) return defaultPopover
      return undefined
    })
  }

  return [
    popupVisible,
    togglePopupVisible,
    onClose,
    popover,
    togglePopover,
  ] as const
}
