import type { Meta, StoryObj } from '@storybook/react'
import { type Table, TableMarkers } from './ComparisonTable.types'
import { DesktopComparisonTable } from './DesktopComparisonTable'

const nbsp = '\u00A0'
const table: Table = {
  head: [TableMarkers.EmptyHeader, 'Basic', 'Standard', 'Premium'],
  body: [
    ['Attribute 1', `30${nbsp}000${nbsp}kr`, `60${nbsp}000${nbsp}kr`, `140${nbsp}000${nbsp}kr`],
    ['Attribute 2', '[*]', '[*]', '[*]'],
    ['Attribute 3', '[]', '[*]', '[*]'],
    ['Attribute 4', '[]', '[*]', '[*]'],
    ['Attribute 5', '[]', '[]', '[*]'],
    ['Attribute 6', '[]', '[]', '[*]'],
  ],
}

type Story = StoryObj<typeof DesktopComparisonTable>

export default {
  title: 'Components/Comparison Table/Desktop',
  component: DesktopComparisonTable,
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=3273-18638&mode=design&t=RSlyuJ47E727hGaQ-4',
    },
    grid: { width: '1/2' },
  },
} as Meta<typeof DesktopComparisonTable>

export const Desktop: Story = {
  render: () => <DesktopComparisonTable {...table} selectedColumn="Premium" />,
}
