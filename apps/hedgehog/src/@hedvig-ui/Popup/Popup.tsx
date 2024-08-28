'use client'

import { DetailedHTMLProps, DetailsHTMLAttributes, useEffect } from 'react'
import * as React from 'react'
import { Button, ButtonProps, useClickOutside } from '@hedvig-ui'
import { useRef, useState } from 'react'
import { Plus } from 'react-bootstrap-icons'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  position: relative;
`

const TargetWrapper = styled.div`
  cursor: pointer;
`

const Content = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  border-radius: 0.4rem;
  background-color: #fafafa;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  z-index: 101;
`

export const Popup: React.FC<
  {
    target?: React.ReactNode
    text?: string
    icon?: React.ReactNode
    buttonSize?: ButtonProps['size']
    clickOnContentClose?: boolean
    shouldClose?: boolean
    setShouldClose?: React.Dispatch<React.SetStateAction<boolean>>
  } & DetailedHTMLProps<DetailsHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  style,
  children,
  target,
  text,
  icon,
  buttonSize,
  clickOnContentClose = true,
  shouldClose = false,
  setShouldClose,
}) => {
  const [showPopup, setShowPopup] = useState(false)
  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, (e) => {
    setShowPopup(false)
    e.stopPropagation()
  })

  useEffect(() => {
    if (shouldClose) {
      setShowPopup(false)
      setShouldClose?.(false)
    }
  }, [shouldClose, setShouldClose])

  return (
    <Wrapper style={style}>
      {target ? (
        <TargetWrapper
          onClick={(e) => {
            e.stopPropagation()
            setShowPopup((prevState) => !prevState)
          }}
        >
          {target}
        </TargetWrapper>
      ) : text ? (
        <Button
          size={buttonSize}
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            setShowPopup((prevState) => !prevState)
          }}
        >
          {text}
        </Button>
      ) : (
        <Button
          size={buttonSize}
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            setShowPopup((prevState) => !prevState)
          }}
          icon={icon ?? <Plus />}
        />
      )}

      {showPopup && (
        <Content
          onClick={() => {
            if (!clickOnContentClose) return
            setShowPopup(false)
          }}
          ref={wrapperRef}
        >
          {children}
        </Content>
      )}
    </Wrapper>
  )
}
