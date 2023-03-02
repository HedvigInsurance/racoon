import styled from '@emotion/styled'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useRef } from 'react'
import { Heading, mq, theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import { usePageState } from './usePageState'

const SUCCESS_ANIMATION_URL = '/confirmation/success-animation.mp4'

type Props = {
  children: React.ReactNode
}

export const SuccessAnimation = ({ children }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, animate, completeAnimation, completeMessage } = usePageState({ videoRef })
  const { t } = useTranslation('checkout')

  return (
    <AnimatePresence>
      {state !== 'content' && (
        <AnimationWrapper key="wrapper" {...WRAPPER_ANIMATION}>
          <AnimatePresence>
            {state === 'video' && (
              <StyledVideo
                ref={videoRef}
                muted={true}
                autoPlay={true}
                playsInline={true}
                preload="auto"
                onEnded={completeAnimation}
                onCanPlayThrough={animate}
                key="animation"
                {...VIDEO_ANIMATION}
              >
                <source src={SUCCESS_ANIMATION_URL} type="video/mp4" />
              </StyledVideo>
            )}

            {state === 'message' && (
              <MessageWrapper
                key="message"
                {...MESSAGE_ANIMATION}
                onAnimationComplete={completeMessage}
              >
                <Heading as="h1" align="center" variant={{ _: 'serif.32', lg: 'serif.56' }}>
                  {t('SUCCESS_ANIMATION_MESSAGE')}
                </Heading>
              </MessageWrapper>
            )}
          </AnimatePresence>
        </AnimationWrapper>
      )}

      {state === 'content' && (
        <motion.div key="default" {...CONTENT_ANIMATION}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const VIDEO_ANIMATION_DURATION = 0.3
const VIDEO_ANIMATION = {
  exit: {
    opacity: 0,
  },
  transition: {
    duration: VIDEO_ANIMATION_DURATION,
    ...theme.transitions.framer.easeInCubic,
  },
} as const

const MESSAGE_ANIMATION_DURATION = 0.5
const MESSAGE_ANIMATION = {
  initial: { opacity: 0, y: 42 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...theme.transitions.framer.easeOutCubic,
      duration: MESSAGE_ANIMATION_DURATION,
      delay: VIDEO_ANIMATION_DURATION,
    },
  },
} as const

const SHOW_MESSAGE_DURATION = 1
const WRAPPER_ANIMATION = {
  exit: {
    opacity: 0,
    y: -42,
    transition: {
      ...theme.transitions.framer.easeInCubic,
      duration: MESSAGE_ANIMATION_DURATION,
      delay: SHOW_MESSAGE_DURATION,
    },
    transitionEnd: { display: 'none' },
  },
} as const

const CONTENT_ANIMATION = {
  initial: { opacity: 0, y: 42 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...theme.transitions.framer.easeOutCubic,
      duration: MESSAGE_ANIMATION_DURATION,
      delay: SHOW_MESSAGE_DURATION + MESSAGE_ANIMATION_DURATION,
    },
  },
} as const

const AnimationWrapper = styled(motion.div)({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.backgroundStandard,
  zIndex: zIndexes.header,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledVideo = styled(motion.video)({
  width: '100%',
  maxWidth: 540,
  position: 'absolute',

  // Remove gray border on iOS: https://stackoverflow.com/questions/52508598/html5-video-element-on-iphone-has-border
  maskImage: 'radial-gradient(white, black)',
  backfaceVisibility: 'hidden',
})

const MessageWrapper = styled(motion.div)({
  // Adjust for optical alignment
  marginTop: `calc(-1 * ${theme.space.md})`,

  // Break text into two lines on mobile
  maxWidth: '21rem',
  [mq.lg]: { maxWidth: 'none' },
})
