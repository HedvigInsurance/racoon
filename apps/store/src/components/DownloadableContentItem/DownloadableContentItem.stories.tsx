import styled from '@emotion/styled'
import type { Meta, StoryObj } from '@storybook/react'
import { mq, theme } from 'ui'
import { DownloadableContentItem } from './DownloadableContentItem'
import { type DownloadableContentProps } from './DownloadableContentItem'

const meta: Meta<typeof DownloadableContentItem> = {
  component: DownloadableContentItem,
  parameters: {
    paddings: [{ name: 'Large', value: '64px', default: true }],
  },
}

export default meta
type Story = StoryObj<typeof DownloadableContentItem>

export const Default: Story = {
  render: () => (
    <Root>
      {items.map((item) => (
        <DownloadableContentItem key={item.thumbnail.id} {...item} />
      ))}
    </Root>
  ),
}

const items: DownloadableContentProps[] = [
  {
    thumbnail: {
      id: 10046027,
      alt: '',
      name: '',
      focus: '',
      title: '',
      filename: 'https://a.storyblok.com/f/165473/3840x2584/ef9bf2f1f9/hedvig-press-car.jpg',
      copyright: '',
      fieldtype: 'asset',
      is_external_url: false,
    },
    url: 'https://a.storyblok.com/f/165473/3840x2584/ef9bf2f1f9/hedvig-press-car.jpg',
  },
  {
    thumbnail: {
      id: 10046029,
      alt: '',
      name: '',
      focus: '',
      title: '',
      filename: 'https://a.storyblok.com/f/165473/1920x1081/a24e5c11ed/burnout-thumbnail.jpg',
      copyright: '',
      fieldtype: 'asset',
      is_external_url: false,
    },
    url: 'https://a.storyblok.com/f/165473/x/0e3c9a3779/car-burnout-hedvig-test.mov',
  },
]

const Root = styled.div({
  display: 'grid',
  columnGap: theme.space.md,
  rowGap: theme.space.lg,
  marginInline: 'auto',
  width: '100%',

  [mq.md]: {
    maxWidth: '800px',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
})
