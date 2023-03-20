import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
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
} as Meta<typeof PriceMatchBubble>

export const Default: StoryFn<typeof PriceMatchBubble> = (props) => {
  return <PriceMatchBubble {...props} />
}
Default.args = {
  title: 'Du sparar 30 kr/mån',
  children: 'Folksam · 239 kr/mån · Går ut feb. 2023',
}
