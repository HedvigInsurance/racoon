import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect, useState, Children } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import type { FontSizeProps, FontSizes } from 'ui'
import { CheckIcon, theme } from 'ui'
import { list, listItem, tickerItemWrapper } from './Ticker.css'

const DURATION = 0.5

export type TickerHeight = {
  tickerHeight: FontSizes
  tickerHeightDesktop: FontSizes
}

type Props = {
  children: Iterable<ReactNode>
  showCheckIcon?: boolean
  size: FontSizeProps
}

export const Ticker = (props: Props) => {
  const [visibleIndex, setVisibleIndex] = useState(0)

  const childrenCount = Children.count(props.children)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prevIndex) => (prevIndex + 1) % childrenCount)
    }, 2000)

    return () => clearInterval(interval)
  }, [childrenCount])

  // Font size is used as height for the ticker to make animation of items responsive
  const classNames = clsx(list, sprinkles({ fontSize: props.size }))

  return (
    <ul className={classNames}>
      <AnimatePresence initial={false}>
        {Children.map(props.children, (child, index) => {
          if (index !== visibleIndex) return null

          return (
            <motion.li
              key={index}
              className={listItem}
              transition={TRANSITION}
              variants={ANIMATION}
              initial="pushDown"
              animate="original"
              exit="pushUp"
            >
              {child}
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}

const DRIFT_HEIGHT = '0.8em'
const ANIMATION: Variants = {
  pushDown: { y: DRIFT_HEIGHT, opacity: 0 },
  original: { y: 0, opacity: 1 },
  pushUp: { y: `-${DRIFT_HEIGHT}`, opacity: 0 },
}
const TRANSITION = { duration: DURATION, ...theme.transitions.framer.easeInOutQuint }

type TickerItemProps = {
  children: React.ReactNode
  showCheckIcon?: boolean
}

export const TickerItem = (props: TickerItemProps) => {
  return (
    <div className={tickerItemWrapper}>
      {props.showCheckIcon && <CheckIcon size="1rem" />}
      {props.children}
    </div>
  )
}
