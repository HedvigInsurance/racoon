import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { Heading } from 'ui'
import * as Timeline from './Timeline'

export default {
  title: 'Timeline',
  component: Timeline.Root,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof Timeline.Root>

const Template: StoryFn<typeof Timeline.Root> = (props) => (
  <Timeline.Root {...props}>
    <Timeline.Item>
      <Timeline.Separator>
        <Timeline.Connector />
        <Timeline.Icon />
        <Timeline.Connector />
      </Timeline.Separator>
      <Timeline.Content>
        <Heading as="h3" variant="standard.18">
          Sign up to Hedvig
        </Heading>
        <p>Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop.</p>
      </Timeline.Content>
    </Timeline.Item>

    <Timeline.Item>
      <Timeline.Separator>
        <Timeline.Connector />
        <Timeline.Icon />
        <Timeline.Connector />
      </Timeline.Separator>

      <Timeline.Content>
        <Heading as="h3" variant="standard.18">
          We cancel your old policy
        </Heading>
        <p>Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop.</p>
      </Timeline.Content>
    </Timeline.Item>

    <Timeline.Item>
      <Timeline.Separator>
        <Timeline.Connector />
        <Timeline.Icon />
        <Timeline.Connector />
      </Timeline.Separator>

      <Timeline.Content>
        <Heading as="h3" variant="standard.18">
          Your new insurance with Hedvig activates when your old expires
        </Heading>
        <p>Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop.</p>
      </Timeline.Content>
    </Timeline.Item>

    <Timeline.Item>
      <Timeline.Separator>
        <Timeline.Connector />
        <Timeline.Icon />
        <Timeline.Connector />
      </Timeline.Separator>

      <Timeline.Content>
        <Heading as="h3" variant="standard.18">
          Your new insurance with Hedvig activates when your old expires
        </Heading>
        <p>Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop.</p>
      </Timeline.Content>
    </Timeline.Item>
  </Timeline.Root>
)

export const Default = Template.bind({})
Default.args = {}
