import { ComponentMeta, Story } from '@storybook/react'
import { ProductSummary, ProductSummaryProps } from './ProductSummary'

export default {
  title: 'Product Page / Product Summary',
  component: ProductSummary,
  argTypes: {},
} as ComponentMeta<typeof ProductSummary>

const Template: Story<ProductSummaryProps> = (props) => {
  return <ProductSummary {...props} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'Hedvig Home',
  children:
    'Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Nam condimentum tempus diam, ultricies sollicitudin erat facilisis eget.',
}
