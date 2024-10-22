import clsx from 'clsx'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { yStack, xStack } from 'ui'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { useCondensedProductHero } from '../useCondensedProductHero'
import { stickyProductHeader, stickyProductHeaderContent } from './StickyProductHeader.css'

type Props = {
  children: React.ReactNode
}

const HERO_TRESHOLD = 250

export function StickyProductHeader({ children }: Props) {
  const { scrollY } = useScroll()
  const [scrolledPast, setScrolledPast] = useState(false)
  const isCondensedProductHero = useCondensedProductHero()
  const showStickyHeader = isCondensedProductHero || scrolledPast

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolledPast(latest > HERO_TRESHOLD)
  })

  // Scroll to top when going to next step to avoid sticky header overlap
  if (isCondensedProductHero) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className={stickyProductHeader}>
      <div
        className={clsx(
          yStack({
            gap: 'md',
            paddingBlock: 'sm',
            paddingInline: 'md',
          }),
          stickyProductHeaderContent.base,
          showStickyHeader && stickyProductHeaderContent.visible,
        )}
      >
        <div
          className={clsx(
            xStack({
              gap: 'sm',
              alignItems: 'center',
            }),
          )}
        >
          {children}
        </div>

        <ProgressBar />
      </div>
    </div>
  )
}
