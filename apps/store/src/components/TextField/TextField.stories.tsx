import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import { type ReactNode } from 'react'
import { yStack } from 'ui'
import { TextField } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'Inputs/TextField',
  component: TextField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
}

export default meta

const Template: StoryFn<typeof TextField> = ({ defaultValue, ...props }) => {
  return (
    <div className={yStack({ gap: 'xl' })}>
      <Variant label="Regular">
        <TextField {...props} />
      </Variant>
      <Variant label="Filled">
        <TextField {...props} defaultValue={defaultValue} />
      </Variant>
      <Variant label="Disabled">
        <TextField {...props} defaultValue={defaultValue} disabled />
      </Variant>
      <Variant label="Warning">
        <TextField
          {...props}
          defaultValue={defaultValue}
          warning
          message="There's something wrong with the value, try again"
        />
      </Variant>
    </div>
  )
}

const Variant = ({ label, children }: { label: string; children: ReactNode }) => (
  <>
    <div className={yStack({ gap: 'xs' })}>
      <div style={{ backgroundColor: '#ECF4F9', width: 'fit-content', padding: '0 0.5rem' }}>
        {label}
      </div>
      {children}
    </div>
  </>
)

const textArgs = {
  label: 'Name',
  defaultValue: 'John Sculley',
  type: 'text',
  inputMode: 'text',
}

export const large = {
  render: Template,
  args: {
    ...textArgs,
    size: 'large',
  },
}

export const medium = {
  render: Template,
  args: {
    ...textArgs,
    size: 'medium',
  },
}

export const small = {
  render: Template,
  args: {
    ...textArgs,
    label: 'Address',
    size: 'small',
    defaultValue: '786 Franklin Ave.',
  },
}

export const number = {
  render: Template,
  args: {
    type: 'text',
    inputMode: 'numeric',
    pattern: '[0-9]*',
    autoComplete: 'off',
    label: 'Weight',
    size: 'medium',
    defaultValue: '150',
    suffix: 'kg',
  },
}
