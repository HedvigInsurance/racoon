import { datadogLogs } from '@datadog/browser-logs'
import { useReducer } from 'react'

type State = 'video' | 'message' | 'content'

enum ActionType {
  'SHOW_MESSAGE',
  'SHOW_CONTENT',
}

type Action = { type: ActionType }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SHOW_MESSAGE:
      return 'message'

    case ActionType.SHOW_CONTENT:
      return 'content'

    default:
      return state
  }
}

type UsePageStateParams = {
  videoRef: React.RefObject<HTMLVideoElement>
}

export const usePageState = ({ videoRef }: UsePageStateParams) => {
  const [state, dispatch] = useReducer(reducer, 'video')

  const animate = async () => {
    try {
      await videoRef.current?.play()
    } catch (error) {
      console.error("Couldn't play video", error)
      datadogLogs.logger.info("Couldn't play video", { error })
      dispatch({ type: ActionType.SHOW_MESSAGE })
    }
  }

  const completeVideo = () => dispatch({ type: ActionType.SHOW_MESSAGE })
  const completeMessage = () => dispatch({ type: ActionType.SHOW_CONTENT })

  return { state, animate, completeAnimation: completeVideo, completeMessage }
}
