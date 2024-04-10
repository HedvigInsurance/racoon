import type { StoryObj } from '@storybook/react'
import { Button, Dialog } from 'ui'
import { CartNotificationContent } from './CartToast'

const config = {
  title: 'Cart / Cart Notification',
  parameters: { grid: { width: '1/3' } },
}

export const Open: StoryObj<typeof CartNotificationContent> = {
  render: (props) => (
    <Dialog.Root open>
      <CartNotificationContent {...props} />
    </Dialog.Root>
  ),

  argTypes: { onClose: { action: 'onClose' } },

  args: {
    name: 'Hemförsäkring',
    price: '179 kr/mån',
  },
}

export const WithDialog: StoryObj<typeof CartNotificationContent> = {
  render: (props) => {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>Open notification</Button>
        </Dialog.Trigger>
        <CartNotificationContent {...props} />
      </Dialog.Root>
    )
  },

  argTypes: { onClose: { action: 'onClose' } },

  args: {
    name: 'Hemförsäkring',
    price: '179 kr/mån',
  },
}

export default config
