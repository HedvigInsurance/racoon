import styled from '@emotion/styled'
import { ComponentMeta, Story } from '@storybook/react'
import { TopMenuDesktop } from './TopMenuDesktop'

export default {
  title: 'TopMenuDesktop',
  component: TopMenuDesktop,
} as ComponentMeta<typeof TopMenuDesktop>

export type TopMenuDesktopProps = {
  currentActiveItem: string
}

const StyledPage = styled.div({
  height: '100vh',
  width: '100vw',
})

const Template: Story<TopMenuDesktopProps> = (props) => (
  <StyledPage>
    <TopMenuDesktop {...props} />
  </StyledPage>
)

export const Desktop = Template.bind({})
Desktop.args = {
  currentActiveItem: 'insurances',
}
