import { Meta, Story } from '@storybook/react'
import { Heading, HeadingProps } from './Heading'

const storyMeta: Meta<HeadingProps> = {
  title: 'Heading',
  component: Heading,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    variant: 'xl',
    headingLevel: 'h1',
    children: 'This is a headline',
  },
}

export default storyMeta

const Template: Story<HeadingProps> = ({ variant, headingLevel, colorVariant, children }) => (
  <Heading variant={variant} headingLevel={headingLevel} colorVariant={colorVariant}>
    {children}
  </Heading>
)

export const LightBackground = Template.bind({})
LightBackground.parameters = { backgrounds: { default: 'Light' } }
LightBackground.args = { colorVariant: 'dark' }
