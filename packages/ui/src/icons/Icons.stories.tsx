import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ArrowForwardIcon } from './ArrowIcon'
import { CheckIcon } from './CheckIcon'
import { CrossIcon } from './CrossIcon'
import { MailIcon } from './MailIcon'
import { PhoneIcon } from './PhoneIcon'
import { IconRootProps } from './Root'
import { TickIcon } from './TickIcon'

export default {
  title: 'Icons',
  component: ArrowForwardIcon,
  argsTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof ArrowForwardIcon>

const Template: ComponentStory<typeof MailIcon> = (props: IconRootProps) => {
  return (
    <div>
      <MailIcon {...props} />
      <div style={{ paddingBottom: '1rem' }}></div>
      <PhoneIcon {...props} />
      <div style={{ paddingBottom: '1rem' }}></div>
      <ArrowForwardIcon {...props} />
      <div style={{ paddingBottom: '1rem' }}></div>
      <CrossIcon {...props} />
      <div style={{ paddingBottom: '1rem' }}></div>
      <CheckIcon {...props} />
      <div style={{ paddingBottom: '1rem' }}></div>
      <TickIcon {...props} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}
