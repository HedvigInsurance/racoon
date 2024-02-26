import type { IPlayerProps } from '@lottiefiles/react-lottie-player'
import { useInView } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { animationWrapper } from './LottieAnimation.css'

type Props = Omit<IPlayerProps, 'src'> & {
  importSrc: () => Promise<IPlayerProps['src']>
}

// Lazy-load both animation data and react-lottie-player
// Saves ~260KB uncompressed size on the main page
export const LottieAnimation = ({ importSrc, ...playerProps }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(wrapperRef, { once: true })
  const [src, setSrc] = useState<string | object | null>(null)
  useEffect(() => {
    if (isInView) {
      // Start loading early to avoid waterfall
      import('@lottiefiles/react-lottie-player')
      importSrc().then(setSrc)
    }
  }, [isInView])
  const ready = isInView && src != null
  return (
    <div ref={wrapperRef} className={animationWrapper}>
      {ready && <PlayerDynamic src={src} {...playerProps} />}
    </div>
  )
}

const PlayerDynamic = dynamic(async () => {
  const { Player } = await import('@lottiefiles/react-lottie-player')
  return { default: Player }
})
