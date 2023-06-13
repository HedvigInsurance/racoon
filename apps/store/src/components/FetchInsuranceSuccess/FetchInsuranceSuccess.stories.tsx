import styled from '@emotion/styled'
import { type Meta, type StoryFn } from '@storybook/react'
import { Space, Text, theme } from 'ui'
import { FetchInsuranceSuccess } from './FetchInsuranceSuccess'

const meta: Meta<typeof FetchInsuranceSuccess> = {
  title: 'Product Page / Fetch Insurance Success',
  args: {
    company: 'Trygg Hansa',
  },
  argTypes: {
    onClick: { action: 'onClick' },
  },
}

export default meta

export const Default: StoryFn<typeof FetchInsuranceSuccess> = (props) => {
  return (
    <DialogWindow>
      <FetchInsuranceSuccess {...props}>
        <Space y={0.5}>
          <Text>Trygg Hansa Hemförsäkring</Text>
          <div>
            <Text size="xs">Stadsgatan 10</Text>
            <Text size="xs" color="textSecondaryOnGray">
              119 kr/mån · Förnyas 28.12.2022
            </Text>
          </div>
        </Space>
      </FetchInsuranceSuccess>
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
