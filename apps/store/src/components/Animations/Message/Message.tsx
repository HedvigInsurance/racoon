import { LottieAnimation } from '../Root'
import animationData from './message.json'

export const Message = () => {
  return <LottieAnimation autoplay loop src={animationData} />
}
