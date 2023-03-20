import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { Space } from 'ui'
import * as Table from './Table'

export default {
  title: 'Table',
  component: Table.Root,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof Table.Root>

const Template: StoryFn<typeof Table.Root> = () => {
  return (
    <Space y={1}>
      <Table.Root layout="fixed">
        <Table.Head>
          <Table.Row>
            <Table.Cell as="th">Insurance</Table.Cell>
            <Table.Cell as="th" align="right">
              Start date
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Hedvig Home</Table.Cell>
            <Table.Cell align="right">Starts 11.03.22</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Hedvig Accident</Table.Cell>
            <Table.Cell align="right">Starts 11.03.22</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Hedvig Travel</Table.Cell>
            <Table.Cell align="right">Starts today</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <Table.Root layout="fixed">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Total price</Table.Cell>
            <Table.Cell align="right">273 kr/mo</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Space>
  )
}

export const Default = Template.bind({})
Default.args = {}
