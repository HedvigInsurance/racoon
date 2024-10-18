import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import type { FontSizeProps, FontSizes } from 'ui'
import { framerTransitions } from 'ui'
import { list, listItem, tickerItemWrapper } from './Ticker.css'

export type TickerHeight = {
  tickerHeight: FontSizes
  tickerHeightDesktop: FontSizes
}

type Props = {
  children: ReactNode
  showCheckIcon?: boolean
  size: FontSizeProps
}

export function Ticker(props: Props) {
  // Font size is used as height for the ticker to make animation of items responsive
  const classNames = clsx(list, sprinkles({ fontSize: props.size }))

  return <ul className={classNames}>{props.children}</ul>
}

const DURATION = 0.5
const DRIFT_HEIGHT = '0.8em'
const ANIMATION: Variants = {
  pushDown: { y: DRIFT_HEIGHT, opacity: 0 },
  original: { y: 0, opacity: 1 },
  pushUp: { y: `-${DRIFT_HEIGHT}`, opacity: 0 },
}
const TRANSITION = { duration: DURATION, ...framerTransitions.easeInOutQuint }

type TickerItemProps = {
  children: React.ReactNode
  showCheckIcon?: boolean
}

export function TickerItem(props: TickerItemProps) {
  return (
    <motion.li
      className={listItem}
      transition={TRANSITION}
      variants={ANIMATION}
      initial="pushDown"
      animate="original"
      exit="pushUp"
    >
      <div className={tickerItemWrapper}>
        {props.showCheckIcon && <CheckIcon size="1rem" />}
        {props.children}
      </div>
    </motion.li>
  )
}

export const useTickerAnimation = (callback: () => void, isInView: boolean, delay = 2000) => {
  // Store timeout ref to clear it on unmount or when the element is not in view
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const animate = () => {
      timeoutRef.current = setTimeout(() => {
        callback()
        animate()
      }, delay)
    }

    if (isInView) {
      animate()
    } else {
      clearTimeout(timeoutRef.current)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [delay, isInView, callback])
}
