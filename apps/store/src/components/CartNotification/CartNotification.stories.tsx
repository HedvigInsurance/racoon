import { Story } from '@storybook/react'
import { Button, Space, Dialog } from 'ui'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
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
  currencyCode: string
  gradientFromColor: string
  gradientToColor: string
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
  currencyCode: 'SEK',
  gradientFromColor: '#f2ff00',
  gradientToColor: '#00fff0',
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
  currencyCode: 'SEK',
  gradientFromColor: '#f2ff00',
  gradientToColor: '#00fff0',
}

export default config

const NotificationContent = ({
  name,
  price,
  currencyCode,
  gradientFromColor,
  gradientToColor,
}: Props) => {
  const formatter = useCurrencyFormatter(currencyCode)

  return (
    <Space y={1.5}>
      <ProductItem
        name={name}
        price={formatter.format(price)}
        gradient={[gradientFromColor, gradientToColor]}
      />

      <Space y={0.5}>
        <Button fullWidth>Proceed to cart (1)</Button>

        <Button variant="outlined" fullWidth>
          Continue shopping
        </Button>
      </Space>
    </Space>
  )
}
