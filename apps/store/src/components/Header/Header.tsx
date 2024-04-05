'use client'

import { motion, Transition } from 'framer-motion'
import { ReactNode } from 'react'
import { bodyBgColor, headerBgTransparentColor } from 'ui/src/theme/vars.css'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { useScrollState } from '@/utils/useScrollState'
import { MENU_BAR_HEIGHT_PX } from './Header.constants'
import { contentWrapper, ghostWrapper, logoWrapper, wrapper } from './Header.css'

const ANIMATION_VARIANTS = {
  SLIDE_IN: {
    y: 0,
    position: 'fixed',
    backgroundColor: bodyBgColor,
    boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
  },
  SLIDE_OUT: {
    position: 'fixed',
    y: '-150%',
  },
  HIDE: {
    y: '-150%',
    transition: { duration: 0 },
  },
} as const

// Source: https://easings.co · easeInOutCubic
const TRANSITION: Transition = { ease: [0.65, 0.05, 0.36, 1] }

type AnimationVariant = keyof typeof ANIMATION_VARIANTS | undefined

type HeaderProps = {
  children: ReactNode
  opaque?: boolean
  static?: boolean
}

export const Header = (props: HeaderProps) => {
  const { children, opaque = false, static: staticPosition = false } = props
  const scrollState = useScrollState({ threshold: MENU_BAR_HEIGHT_PX * 2 })

  const initialStyles = {
    backgroundColor: opaque ? bodyBgColor : headerBgTransparentColor,
  }

  let animate: AnimationVariant = scrollState === 'SCROLL_UP' ? 'SLIDE_IN' : undefined
  animate = scrollState === 'BELOW' ? 'HIDE' : animate
  animate = scrollState === 'SCROLL_DOWN' ? 'SLIDE_OUT' : animate
  animate = staticPosition ? undefined : animate

  return (
    <div style={initialStyles} className={ghostWrapper}>
      <motion.header
        className={wrapper}
        initial={initialStyles}
        variants={ANIMATION_VARIANTS}
        animate={animate}
        transition={TRANSITION}
      >
        <div className={logoWrapper}>
          <LogoHomeLink />
        </div>
        <div className={contentWrapper}>{children}</div>
      </motion.header>
    </div>
  )
}
