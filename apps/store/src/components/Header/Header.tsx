'use client'
import type { Transition } from 'framer-motion'
import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { bodyBgColor } from 'ui/src/theme/vars.css'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { isBrowser } from '@/utils/env'
import { useScrollState } from '@/utils/useScrollState'
import { MENU_BAR_HEIGHT_PX } from './Header.constants'
import { menuWrapper, ghostWrapper, logoWrapper, wrapper, contentWrapper } from './Header.css'

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

export const Header = (props: PropsWithChildren<unknown>) => {
  const { children } = props
  const scrollState = useScrollState({ threshold: MENU_BAR_HEIGHT_PX * 2 })

  const initialStyles = {
    backgroundColor: bodyBgColor,
  }

  let animate: AnimationVariant = undefined
  if (
    isBrowser() &&
    window.document.querySelector('main[data-supports-sticky-header=true]') != null
  ) {
    switch (scrollState) {
      case 'SCROLL_UP':
        animate = 'SLIDE_IN'
        break
      case 'SCROLL_DOWN':
        animate = 'SLIDE_OUT'
        break
      case 'BELOW':
        animate = 'HIDE'
        break
    }
  }

  return (
    <div className={ghostWrapper}>
      <motion.header
        className={wrapper}
        initial={initialStyles}
        variants={ANIMATION_VARIANTS}
        animate={animate}
        transition={TRANSITION}
      >
        <div className={contentWrapper}>
          <div className={logoWrapper}>
            <LogoHomeLink />
          </div>
          {children ? <div className={menuWrapper}>{children}</div> : null}
        </div>
      </motion.header>
    </div>
  )
}
