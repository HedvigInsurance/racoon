import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { QuickPurchaseForm, type ProductOption } from './QuickPurchaseForm'

export default {
  title: 'QuickPurchaseForm',
  component: QuickPurchaseForm,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof QuickPurchaseForm>

const options: Array<ProductOption> = [
  {
    name: 'Accident',
    value: 'SE_ACCIDENT',
    img: {
      src: 'https://a.storyblok.com/f/165473/832x832/d6bf60c98b/hedvig-pillow-accident.png',
    },
  },
  {
    name: 'Car',
    value: 'SE_CAR',
    img: {
      src: 'https://a.storyblok.com/f/165473/832x832/001eb5c8a1/hedvig-pillow-car.png',
    },
  },
]

const Template: StoryFn<typeof QuickPurchaseForm> = () => {
  return <QuickPurchaseForm productOptions={options} onSubmit={(e) => e.preventDefault()} />
}

export const Default = Template.bind({})
Default.args = {}
