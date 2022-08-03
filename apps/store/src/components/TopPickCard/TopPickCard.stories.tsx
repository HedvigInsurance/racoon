import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TopPickCard } from './TopPickCard'

export default {
  title: 'TopPickCard',
  component: TopPickCard,
} as ComponentMeta<typeof TopPickCard>

const Template: ComponentStory<typeof TopPickCard> = (props) => <TopPickCard {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Hedvig Home',
  subtitle: 'Complete coverage for your home',
  image: { src: 'https://via.placeholder.com/327x400' },
}
