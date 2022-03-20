import { BodyText, BodyTextProps } from './body'
import { Meta, Story } from '@storybook/react'

const storyMeta: Meta<BodyTextProps> = {
  title: 'Body text',
  component: BodyText,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    variant: 0,
    children: 'This is some body text',
  },
}

export default storyMeta

const Template: Story<BodyTextProps> = ({ variant, headingLevel, colorVariant, children }) => (
  <BodyText variant={variant} headingLevel={headingLevel} colorVariant={colorVariant}>
    {children}
  </BodyText>
)

export const LightBackground = Template.bind({})
LightBackground.parameters = { backgrounds: { default: 'Light' } }
LightBackground.args = { colorVariant: 'dark' }
