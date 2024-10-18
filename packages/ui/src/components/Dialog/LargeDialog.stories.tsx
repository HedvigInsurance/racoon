import { type Meta, type StoryFn } from '@storybook/react'
import { yStack } from '../../patterns'
import { Button } from '../Button/Button'
import { Text } from '../Text/Text'
import { LargeDialog } from './LargeDialog'

export default {
  title: 'Dialog',
  parameters: {
    backgrounds: {
      default: 'gray100',
    },
    layout: 'centered',
  },
} as Meta<unknown>

export const Large: StoryFn = () => {
  return (
    <div>
      <LargeDialog.Root>
        <div className={yStack({ gap: 'md' })}>
          Button opens dialog
          <LargeDialog.Trigger asChild>
            <Button variant="secondary">Click me</Button>
          </LargeDialog.Trigger>
        </div>

        <LargeDialog.Content>
          <LargeDialog.Header>Hello_world!</LargeDialog.Header>
          <Text>
            Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep
            trop. Lorem ipsum dolor sit amet, florrum plorrum.
          </Text>
        </LargeDialog.Content>
      </LargeDialog.Root>
    </div>
  )
}
