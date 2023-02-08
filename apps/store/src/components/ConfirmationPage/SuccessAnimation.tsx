import styled from '@emotion/styled'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const SUCCESS_ANIMATION_URL = '/confirmation/success-animation.mp4'

type Props = {
  children: React.ReactNode
}

export const SuccessAnimation = ({ children }: Props) => {
  const [showVideo, setShowVideo] = useState(true)
  const handleEnded = () => setShowVideo(false)

  return (
    <AnimatePresence initial={false}>
      {showVideo ? (
        <VideoWrapper exit={{ opacity: 0 }}>
          <StyledVideo autoPlay={true} muted={true} preload="auto" onEnded={handleEnded}>
            <source src={SUCCESS_ANIMATION_URL} type="video/mp4" />
          </StyledVideo>
        </VideoWrapper>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0.05, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const VideoWrapper = styled(motion.div)({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.backgroundStandard,
  zIndex: zIndexes.header,
  display: 'flex',
  placeItems: 'center',
})

const StyledVideo = styled.video({ width: '100%' })
