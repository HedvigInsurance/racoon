import { Heading, Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = ({
  firstName,
  currency,
  cost,
  products,
}: ConfirmationPageProps) => {
  const currencyFormatter = useCurrencyFormatter(currency)

  return (
    <Space y={2}>
      <header>
        <Space y={0.25}>
          <Heading headingLevel="h1" colorVariant="dark" variant="s">
            Welcome, {firstName}
          </Heading>
          <p>
            <Text size="s">
              Thank you for joining Hedvig. You can access all information and help you need in the
              Hedvig app.
            </Text>
          </p>
        </Space>
      </header>

      <main>
        <Heading headingLevel="h2" colorVariant="dark" variant="xs">
          Purchase summary
        </Heading>

        <table>
          <tbody>
            {products.map((product) => (
              <tr key={product.name}>
                <td>
                  <Text size="m">{product.name}</Text>
                </td>
                <td>
                  <Text size="m">Starts today</Text>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <Text size="m">Total price</Text>
              </td>
              <td>
                <Text size="m">{currencyFormatter.format(cost.total)}</Text>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </Space>
  )
}
