import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStoryFn } from '@storybook/react'
import { PriceMatchBubble } from './PriceMatchBubble'

export default {
  title: 'Product Page / Price Match Bubble',
  component: PriceMatchBubble,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof PriceMatchBubble>

export const Default: ComponentStoryFn<typeof PriceMatchBubble> = (props) => {
  return <PriceMatchBubble {...props} />
}
Default.args = {
  title: 'Du sparar 30 kr/mån',
  children: 'Folksam · 239 kr/mån · Går ut feb. 2023',
}
