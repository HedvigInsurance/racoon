import styled from '@emotion/styled'
import type { Variants} from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect, useState, Children } from 'react'
import { CheckIcon, Text, theme } from 'ui'

const DURATION = 1

type Props = {
  children: Iterable<ReactNode>
}

export const Ticker = (props: Props) => {
  const [visibleIndex, setVisibleIndex] = useState(0)

  const childrenCount = Children.count(props.children)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prevIndex) => (prevIndex + 1) % childrenCount)
    }, 3000)

    return () => clearInterval(interval)
  }, [childrenCount])

  return (
    <List>
      <AnimatePresence initial={false}>
        {Children.map(props.children, (child, index) => {
          if (index !== visibleIndex) return null

          return (
            <ListItem
              key={index}
              transition={TRANSITION}
              variants={ANIMATION}
              initial="pushDown"
              animate="original"
              exit="pushUp"
            >
              {child}
            </ListItem>
          )
        })}
      </AnimatePresence>
    </List>
  )
}

const DRIFT_HEIGHT = '1.5rem'
const ANIMATION: Variants = {
  pushDown: { y: DRIFT_HEIGHT, opacity: 0 },
  original: { y: 0, opacity: 1 },
  pushUp: { y: `-${DRIFT_HEIGHT}`, opacity: 0 },
}
const TRANSITION = { duration: DURATION, ease: 'anticipate' }

const List = styled.ul({
  position: 'relative',
  height: '2.5rem',
  overflow: 'hidden',
})

const ListItem = styled(motion.li)({
  position: 'absolute',
  inset: 0,
})

type TickerItemProps = {
  children: string
}

export const TickerItem = (props: TickerItemProps) => {
  return (
    <TickerItemWrapper>
      <CheckIcon size="1rem" />
      <Text as="p" size="xs">
        {props.children}
      </Text>
    </TickerItemWrapper>
  )
}

const TickerItemWrapper = styled.div({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,
})
