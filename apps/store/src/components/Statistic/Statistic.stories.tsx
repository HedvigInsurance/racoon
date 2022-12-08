import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Label } from 'ui'
import * as Statistic from './Statistic'

type Props = {
  label: string
  description: string
  value: string
}

const Component = ({ label, description, value }: Props) => {
  return (
    <Statistic.Root>
      <Label color="#D2E6F1">{label}</Label>
      <Statistic.Description>{description}</Statistic.Description>
      <Statistic.Value>{value}</Statistic.Value>
    </Statistic.Root>
  )
}

export default {
  title: 'Statistic',
  component: Component,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof Component>

const Template: ComponentStory<typeof Component> = (props) => <Component {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Deductible',
  description: 'For all-risk damage including water damages',
  value: 'SEK 1,500',
}
