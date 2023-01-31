import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from './numberPad.json'

export const NumberPad = () => {
  return <Player autoplay loop src={animationData} />
}
