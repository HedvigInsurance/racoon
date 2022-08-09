import { ComponentMeta, Story } from '@storybook/react'
import { SupportBlock } from './SupportBlock'

export default {
  title: 'Support Block',
  component: SupportBlock,
} as ComponentMeta<typeof SupportBlock>

export const Default: Story = (props) => {
  return <SupportBlock {...props} />
}
