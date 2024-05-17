import type { Meta, StoryObj } from '@storybook/react'
import * as ComparisonTable from './ComparisonTable'

type Story = StoryObj<typeof ComparisonTable.Root>

export default {
  title: 'Components/Comparison Table',
  component: ComparisonTable.Root,
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=3273-18638&mode=design&t=RSlyuJ47E727hGaQ-4',
    },
    grid: { width: '1/2' },
  },
} as Meta<typeof ComparisonTable.Root>

export const Default: Story = {
  render: () => (
    <ComparisonTable.Root>
      <ComparisonTable.Head>
        <ComparisonTable.Header />
        <ComparisonTable.Header>Hel</ComparisonTable.Header>
        <ComparisonTable.Header active={true}>Halv</ComparisonTable.Header>
        <ComparisonTable.Header>Trafik</ComparisonTable.Header>
      </ComparisonTable.Head>
      <ComparisonTable.Body>
        <ComparisonTable.Row>
          <ComparisonTable.TitleDataCell title="Personskador" />
          <ComparisonTable.DataCell>
            <ComparisonTable.CheckIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell active={true}>
            <ComparisonTable.CheckIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell>
            <ComparisonTable.MissingIcon />
          </ComparisonTable.DataCell>
        </ComparisonTable.Row>
        <ComparisonTable.Row>
          <ComparisonTable.TitleDataCell title="Andras skada" />
          <ComparisonTable.DataCell>
            <ComparisonTable.CheckIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell active={true}>
            <ComparisonTable.CheckIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell>
            <ComparisonTable.MissingIcon />
          </ComparisonTable.DataCell>
        </ComparisonTable.Row>
        <ComparisonTable.Row>
          <ComparisonTable.TitleDataCell title="Stöld & inbrott" />
          <ComparisonTable.DataCell>
            <ComparisonTable.CheckIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell active={true}>
            <ComparisonTable.MissingIcon />
          </ComparisonTable.DataCell>
          <ComparisonTable.DataCell>
            <ComparisonTable.MissingIcon />
          </ComparisonTable.DataCell>
        </ComparisonTable.Row>
      </ComparisonTable.Body>
    </ComparisonTable.Root>
  ),
}
