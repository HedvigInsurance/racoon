import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { type Table, TableMarkers } from './ComparisonTable.types'
import { MobileComparisonTable } from './MobileComparisonTable'

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

type Story = StoryObj<typeof MobileComparisonTable>

export default {
  title: 'Components/Comparison Table/Mobile',
  component: MobileComparisonTable,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12mini',
    },
  },
} as Meta<typeof MobileComparisonTable>

export const Mobile: Story = {
  render: () => <MobileComparisonTable {...table} />,
}
