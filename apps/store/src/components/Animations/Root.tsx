import styled from '@emotion/styled'
import { Player } from '@lottiefiles/react-lottie-player'
import { mq } from 'ui'

export const LottieAnimation = styled(Player)({
  width: '5rem',
  height: '5rem',
  [mq.md]: {
    width: '7.5rem',
    height: '7.5rem',
  },
})
