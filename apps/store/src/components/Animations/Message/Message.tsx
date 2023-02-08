import dynamic from 'next/dynamic'
import animationData from './message.json'

const LottieAnimation = dynamic(() => import('../Root').then((mod) => mod.LottieAnimation))

export const Message = () => {
  return <LottieAnimation autoplay loop src={animationData} />
}
