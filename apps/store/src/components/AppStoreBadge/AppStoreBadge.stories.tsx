import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Locale } from '@/utils/l10n/types'
import { AppStoreBadge } from './AppStoreBadge'

export default {
  title: 'AppStoreBadge',
  component: AppStoreBadge,
  args: {},
} as ComponentMeta<typeof AppStoreBadge>

const Template: ComponentStory<typeof AppStoreBadge> = (args) => {
  return <AppStoreBadge {...args} />
}

export const Apple = Template.bind({})
Apple.args = {
  type: 'apple',
  locale: Locale.SvSe,
}

export const Google = Template.bind({})
Google.args = {
  type: 'google',
  locale: Locale.SvSe,
}
