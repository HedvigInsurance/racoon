import { ComponentMeta, Story } from '@storybook/react'
import { PriceFooter, PriceFooterProps } from './PriceFooter'

export default {
  title: 'Product Page / Price Footer',
  component: PriceFooter,
  argTypes: {},
} as ComponentMeta<typeof PriceFooter>

const Template: Story<PriceFooterProps> = (props) => {
  return (
    <PriceFooter {...props}>
      <span>SEK 149/mp.</span>
      <span>Add to cart</span>
    </PriceFooter>
  )
}

export const Default = Template.bind({})
Default.args = {}
