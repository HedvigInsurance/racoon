import type { Meta, StoryObj } from '@storybook/react'
import { type Table, TableMarkers } from './ComparisonTable.types'
import { DesktopComparisonTable } from './DesktopComparisonTable'

const nbsp = '\u00A0'
const table: Table = {
  head: [TableMarkers.EmptyHeader, 'Basic', 'Standard', 'Premium'],
  body: [
    [
      { title: 'Attribute 1' },
      `30${nbsp}000${nbsp}kr`,
      `60${nbsp}000${nbsp}kr`,
      `140${nbsp}000${nbsp}kr`,
    ],
    [{ title: 'Attribute 2' }, '[*]', '[*]', '[*]'],
    [{ title: 'Attribute 3' }, '[]', '[*]', '[*]'],
    [{ title: 'Attribute 4' }, '[]', '[*]', '[*]'],
    [{ title: 'Attribute 5', description: 'Some description' }, '[]', '[]', '[*]'],
    [{ title: 'Attribute 6' }, '[]', '[]', '[*]'],
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
