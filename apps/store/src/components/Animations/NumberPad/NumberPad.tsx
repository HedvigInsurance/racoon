import dynamic from 'next/dynamic'
import animationData from './numberPad.json'

const LottieAnimation = dynamic(() => import('../Root').then((mod) => mod.LottieAnimation))

export const NumberPad = () => {
  return <LottieAnimation autoplay loop src={animationData} />
}
