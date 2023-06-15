import { Meta, StoryFn } from '@storybook/react'
import { TopPickCard } from './TopPickCard'

export default {
  component: TopPickCard,
} as Meta<typeof TopPickCard>

const Template: StoryFn<typeof TopPickCard> = (props) => <TopPickCard {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Hedvig Home',
  subtitle: 'Complete coverage for your home',
  image: { src: 'https://via.placeholder.com/327x400' },
}
