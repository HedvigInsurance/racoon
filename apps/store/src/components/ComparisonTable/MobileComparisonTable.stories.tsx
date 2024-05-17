import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { type Table, TableMarkers } from './ComparisonTable.types'
import { MobileComparisonTable } from './MobileComparisonTable'

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
    [{ title: 'Attribute 4', description: 'Some description' }, '[]', '[*]', '[*]'],
    [{ title: 'Attribute 5' }, '[]', '[]', '[*]'],
    [{ title: 'Attribute 6' }, '[]', '[]', '[*]'],
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
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=3388-14879&mode=design&t=RSlyuJ47E727hGaQ-4',
    },
  },
} as Meta<typeof MobileComparisonTable>

export const Mobile: Story = {
  render: () => <MobileComparisonTable {...table} />,
}
