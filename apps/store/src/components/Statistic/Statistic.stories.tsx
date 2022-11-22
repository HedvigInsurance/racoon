import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import * as Statistic from './Statistic'

type Props = {
  badge: string
  label: string
  value: string
}

const Component = ({ badge, label, value }: Props) => {
  return (
    <Statistic.Root>
      <Statistic.Badge>{badge}</Statistic.Badge>
      <Statistic.Description>{label}</Statistic.Description>
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
  badge: 'Deductible',
  label: 'For all-risk damage including water damages',
  value: 'SEK 1,500',
}
