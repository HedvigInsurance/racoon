import { ComponentMeta, Story } from '@storybook/react'
import * as PriceFooter from './PriceFooter'

export default {
  title: 'Product Page / Price Footer',
  component: PriceFooter.Footer,
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof PriceFooter.Footer>

const Template: Story<PriceFooter.ButtonProps> = (props) => {
  return (
    <PriceFooter.Footer {...props}>
      <PriceFooter.Button onClick={props.onClick}>
        <span>SEK 149/mp.</span>
        <span>Add to cart</span>
      </PriceFooter.Button>
    </PriceFooter.Footer>
  )
}

export const Default = Template.bind({})
Default.args = {}
