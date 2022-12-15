import { Story } from '@storybook/react'
import { Button, Space, Dialog } from 'ui'
import { CurrencyCode } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { Header } from './Header'
import { Main } from './Main'
import { ProductItem } from './ProductItem'

const config = {
  title: 'Cart Notification',
  argTypes: {},
}

type Props = {
  name: string
  price: number
  currencyCode: CurrencyCode
}

const Template: Story<Props> = (props) => {
  return (
    <>
      <Header>Insurance added to cart</Header>
      <NotificationContent {...props} />
    </>
  )
}

export const Content = Template.bind({})
Content.args = {
  name: 'Hedvig Home',
  price: 179,
  currencyCode: CurrencyCode.Sek,
}

const TemplateWithDialog: Story<Props> = (props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open notification</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Main y={1.5}>
          <Header>Insurance added to cart</Header>
          <NotificationContent {...props} />
        </Main>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const WithDialog = TemplateWithDialog.bind({})
WithDialog.args = {
  name: 'Hedvig Home',
  price: 179,
  currencyCode: CurrencyCode.Sek,
}

export default config

// TODO: use CartToast or nothing - does not make sense to have separate presentational component here in story
const NotificationContent = ({ name, price, currencyCode }: Props) => {
  const formatter = useFormatter()

  return (
    <Space y={1.5}>
      <ProductItem name={name} price={formatter.money({ amount: price, currencyCode })} />

      <Space y={0.5}>
        <Button fullWidth>Proceed to cart (1)</Button>

        <Button variant="outlined" fullWidth>
          Continue shopping
        </Button>
      </Space>
    </Space>
  )
}
