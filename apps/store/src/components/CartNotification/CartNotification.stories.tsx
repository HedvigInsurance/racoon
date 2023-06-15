import { StoryFn } from '@storybook/react'
import { Button, Dialog } from 'ui'
import { CartNotificationContent } from './CartToast'

const config = {
  title: 'Cart / Cart Notification',
}

export const Open: StoryFn<typeof CartNotificationContent> = (props) => (
  <Dialog.Root open>
    <CartNotificationContent {...props} />
  </Dialog.Root>
)
Open.argTypes = { onClose: { action: 'onClose' } }
Open.args = {
  name: 'Hemförsäkring',
  price: '179 kr/mån',
}

export const WithDialog: StoryFn<typeof CartNotificationContent> = (props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open notification</Button>
      </Dialog.Trigger>
      <CartNotificationContent {...props} />
    </Dialog.Root>
  )
}
WithDialog.argTypes = { onClose: { action: 'onClose' } }
WithDialog.args = {
  name: 'Hemförsäkring',
  price: '179 kr/mån',
}

export default config
