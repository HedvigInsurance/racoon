import { LottieAnimation } from '../LottieAnimation'

const importSrc = () => import('./message.json')

export const Message = () => {
  return <LottieAnimation autoplay loop importSrc={importSrc} />
}
