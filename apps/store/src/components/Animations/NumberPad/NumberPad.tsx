import { LottieAnimation } from '../LottieAnimation'

const importSrc = () => import('./numberPad.json')

export const NumberPad = () => {
  return <LottieAnimation autoplay loop importSrc={importSrc} />
}
