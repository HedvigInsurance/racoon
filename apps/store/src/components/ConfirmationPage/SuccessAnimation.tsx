import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducer, useRef } from 'react'
import { theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const SUCCESS_ANIMATION_URL = '/confirmation/success-animation.mp4'

type Props = {
  children: React.ReactNode
}

export const SuccessAnimation = ({ children }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, animate, complete } = usePageState({ videoRef })

  if (state === 'complete') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0.05, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence initial={false}>
      <VideoWrapper exit={{ opacity: 0 }}>
        <StyledVideo
          ref={videoRef}
          muted={true}
          autoPlay={true}
          playsInline={true}
          preload="auto"
          onEnded={complete}
          onCanPlayThrough={animate}
        >
          <source src={SUCCESS_ANIMATION_URL} type="video/mp4" />
        </StyledVideo>
      </VideoWrapper>
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

const StyledVideo = styled.video({
  width: '100%',
  maxWidth: 540,
  marginInline: 'auto',

  // Remove gray border on iOS: https://stackoverflow.com/questions/52508598/html5-video-element-on-iphone-has-border
  webkitMaskImage: '-webkit-radial-gradient(white, black)',
  webkitBackfaceVisibility: 'hidden',
  mozBackfaceVisibility: 'hidden',
})

type State = 'idle' | 'animation' | 'complete'

enum ActionType {
  'ANIMATE',
  'COMPLETE',
}

type Action = { type: ActionType }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ANIMATE:
      return 'animation'

    case ActionType.COMPLETE:
      return 'complete'

    default:
      return state
  }
}

type UsePageStateParams = {
  videoRef: React.RefObject<HTMLVideoElement>
}

const usePageState = ({ videoRef }: UsePageStateParams) => {
  const [state, dispatch] = useReducer(reducer, 'idle')

  const animate = async () => {
    try {
      await videoRef.current?.play()
      dispatch({ type: ActionType.ANIMATE })
    } catch (error) {
      console.error("Couldn't play video", error)
      datadogLogs.logger.info("Couldn't play video", { error })
      dispatch({ type: ActionType.COMPLETE })
    }
  }

  const complete = () => dispatch({ type: ActionType.COMPLETE })

  return { state, animate, complete }
}
