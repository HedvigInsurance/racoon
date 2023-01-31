import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from './message.json'

export const Message = () => {
  return <Player autoplay loop src={animationData} />
}
