import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { Heading, HeadingProps } from './Heading'

export default {
  title: 'Heading New',
  component: Heading,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    variant: 'serif.72',
    children: 'This is a Heading',
  },
} as Meta<typeof Heading>

const Template: StoryFn<HeadingProps> = ({ children, ...rest }) => (
  <Heading {...rest}>{children}</Heading>
)

export const LightBackground = Template.bind({})
LightBackground.parameters = { backgrounds: { default: 'Light' } }
LightBackground.args = { color: 'textPrimary' }

export const DarkBackground = Template.bind({})
DarkBackground.parameters = { backgrounds: { default: 'Dark' } }
DarkBackground.args = { color: 'textNegative' }

export const WithBoarder: StoryFn<HeadingProps> = ({ children, ...rest }) => (
  <StyledHeading {...rest}>{children}</StyledHeading>
)

const StyledHeading = styled(Heading)({
  border: '2px dotted black',
})
