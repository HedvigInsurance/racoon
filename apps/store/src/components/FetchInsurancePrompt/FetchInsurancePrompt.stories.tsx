import styled from '@emotion/styled'
import { type Meta, type StoryFn } from '@storybook/react'
import { theme } from 'ui'
import { FetchInsurancePrompt } from './FetchInsurancePrompt'

const meta: Meta<typeof FetchInsurancePrompt> = {
  title: 'Purchase Form / Fetch Insurance Prompt',
  args: {
    company: 'Trygg Hansa',
  },
  argTypes: {
    onClickConfirm: { action: 'onClickConfirm' },
    onClickSkip: { action: 'onClickCancel' },
  },
}

export default meta

export const Default: StoryFn<typeof FetchInsurancePrompt> = (props) => {
  return (
    <DialogWindow>
      <FetchInsurancePrompt {...props} />
    </DialogWindow>
  )
}

const DialogWindow = styled.div({
  width: '100%',
  maxWidth: '30rem',
  padding: theme.space.md,
  paddingTop: theme.space.lg,
  borderRadius: theme.radius.sm,
  boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.colors.white,
})
