import styled from '@emotion/styled'
import type { Meta, StoryObj } from '@storybook/react'
import { theme } from 'ui'
import { WarningPrompt } from './WarningPrompt'

const meta: Meta<typeof WarningPrompt> = {
  title: 'Purchase Form / WarningPrompt',
  component: WarningPrompt,
}

export default meta
type Story = StoryObj<typeof WarningPrompt>

export const Default: Story = {
  args: {
    header: 'Du står inte som ägare',
    message:
      'För att kunna teckna en försäkring för ABH234 behöver du stå som registrerad ägare för bilen inom 8 dagar',
  },
  render: (args) => (
    <DialogWindow>
      <WarningPrompt {...args} />
    </DialogWindow>
  ),
}

const DialogWindow = styled.div({
  width: '100%',
  maxWidth: '24rem',
  borderRadius: theme.radius.sm,
  boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.colors.white,
})
