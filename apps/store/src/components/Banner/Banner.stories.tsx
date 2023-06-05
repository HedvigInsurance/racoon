import type { Meta, StoryObj } from '@storybook/react'
import { Banner } from './Banner'

type Story = StoryObj<typeof Banner>

const meta: Meta<typeof Banner> = {
  title: 'Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
  },
}

const noopHandleClose = () => {}

export const Info: Story = {
  render: () => (
    <Banner handleClose={noopHandleClose}>
      <span>
        Here’s a message with random information ·{' '}
        <a style={{ textDecoration: 'underline' }} href="#">
          Read more
        </a>
      </span>
    </Banner>
  ),
}

export const Campaign: Story = {
  render: () => (
    <Banner variant="campaign" handleClose={noopHandleClose}>
      Campaign code applied
    </Banner>
  ),
}

export const Warning: Story = {
  render: () => (
    <Banner variant="warning" handleClose={noopHandleClose}>
      Price quote unavailable
    </Banner>
  ),
}

export const Error: Story = {
  render: () => (
    <Banner variant="error" handleClose={noopHandleClose}>
      An unknown error has occured
    </Banner>
  ),
}

export const LongText: Story = {
  render: () => (
    <Banner handleClose={noopHandleClose}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget nunc cursus, laoreet leo
      ut, mollis odio. Nunc egestas, nisi ac lobortis bibendum, libero
    </Banner>
  ),
}

export default meta
