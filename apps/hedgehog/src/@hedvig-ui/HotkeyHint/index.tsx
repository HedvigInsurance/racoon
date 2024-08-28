'use client'

import styled from '@emotion/styled'
import { useState } from 'react'
import * as React from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { Key } from '../hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import { css } from '@emotion/react'
import { useRemindersCookies } from '../hooks/use-reminder'

const Wrapper = styled.div`
  position: relative;

  width: fit-content;
  height: fit-content;
  z-index: 100;
`

const HintContainer = styled(motion.div)<{ variant?: 'secondary' }>`
  position: absolute;

  right: 0;

  width: fit-content;

  display: flex;
  align-items: center;
  gap: 0.3rem;

  background-color: ${({ theme, variant }) =>
    variant !== 'secondary' ? theme.semiStrongForeground : 'transparent'};
  border-radius: 0.25rem;
  padding: 0.3rem 0.3rem 0.3rem 0.5rem;

  & p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.small};
    font-weight: 600;
    white-space: nowrap;
    color: ${({ theme, variant }) =>
      variant !== 'secondary'
        ? chroma(theme.placeholderColor).brighten(0.6).hex()
        : theme.placeholderColor} !important;
  }
`

export const HintPlus = styled.span<{
  dark?: boolean
  padding?: boolean
  variant?: 'secondary'
}>`
  color: ${({ theme, variant, dark }) =>
    variant !== 'secondary'
      ? dark
        ? theme.semiStrongForeground
        : theme.accentContrast
      : theme.placeholderColor} !important;

  ${({ padding }) =>
    padding &&
    css`
      padding: 0 0.25rem;
    `}

  font-size: 0.85rem;
`

export const HintKey = styled.div<{ dark?: boolean; variant?: 'secondary' }>`
  display: inline-block;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${({ theme, variant, dark }) =>
    variant !== 'secondary'
      ? chroma(dark ? theme.foreground : theme.placeholderColor)
          .alpha(0.6)
          .hex()
      : theme.hotkeyBackground};

  font-size: 0.85rem;
  white-space: nowrap;
  letter-spacing: 0.05rem;
  color: ${({ theme, variant }) =>
    variant !== 'secondary'
      ? theme.accentContrast
      : theme.hotkeyText} !important;
`

export interface HotkeyHintProps extends HTMLMotionProps<'div'> {
  text: string
  keys?: Key[]
  wrapperStyles?: React.CSSProperties
  position?: 'top' | 'bottom'
  side?: 'left' | 'right'
  disabled?: boolean
  remind?: boolean
}

export const HotkeyHint: React.FC<HotkeyHintProps> = ({
  children,
  wrapperStyles,
  disabled,
  keys,
  text,
  remind,
  ...props
}) => {
  const [showHint, setShowHint] = useState(false)
  const { showReminder } = useRemindersCookies()

  const clickHotkeyHandler = () => {
    showReminder(text, keys)
  }

  return (
    <Wrapper
      onMouseEnter={() => {
        if (!disabled) {
          setShowHint(true)
        }
      }}
      onMouseLeave={() => {
        if (!disabled) {
          setShowHint(false)
        }
      }}
      style={wrapperStyles}
      onClick={clickHotkeyHandler}
    >
      <>
        {children}
        <AnimatePresence>
          {showHint && <Hint keys={keys} text={text} {...props} />}
        </AnimatePresence>
      </>
    </Wrapper>
  )
}

export const Hint: React.FC<
  Omit<HotkeyHintProps, 'onResolve'> & {
    variant?: 'secondary'
    textPosition?: 'left' | 'right'
  }
> = ({
  text,
  keys,
  position,
  side,
  variant,
  textPosition = 'left',
  ...props
}) => {
  const positionStyles: React.CSSProperties =
    position === 'bottom'
      ? { top: 'calc(100% + 5px)' }
      : { bottom: 'calc(100% + 5px)' }

  const sideStyles: React.CSSProperties = side ? { [side]: 0 } : {}

  return (
    <HintContainer
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 15, opacity: 0 }}
      variant={variant}
      style={{ ...positionStyles, ...sideStyles }}
      {...props}
    >
      {textPosition === 'left' && <p>{text}</p>}
      {keys?.map((key, index) => (
        <React.Fragment key={text + key.hint}>
          {index !== 0 && <HintPlus variant={variant}>+</HintPlus>}
          <HintKey variant={variant}>
            {key.code === 'Enter' ? 'Enter' : (key.hintAlternative ?? key.hint)}
          </HintKey>
        </React.Fragment>
      ))}
      {textPosition === 'right' && <p>{text}</p>}
    </HintContainer>
  )
}
