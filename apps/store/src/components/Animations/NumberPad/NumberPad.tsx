import { LottieAnimation } from '../Root'
import animationData from './numberPad.json'

export const NumberPad = () => {
  return <LottieAnimation autoplay loop src={animationData} />
}
