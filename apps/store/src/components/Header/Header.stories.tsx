import { ComponentMeta, Story } from '@storybook/react'
import { useBreakpoint } from 'ui'
import { Header } from './Header'
import { TopMenu } from './TopMenu'

export default {
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>

export type TopMenuMobileProps = {
  isOpen: boolean
  currentActiveItem: string
}

const Template: Story<TopMenuMobileProps> = (props) => {
  const isDesktop = useBreakpoint('md')

  return (
    <>
      <Header>
        {isDesktop ? (
          <TopMenu.Desktop isOpen={false} currentActiveItem={''} />
        ) : (
          <TopMenu.Mobile isOpen={false} currentActiveItem={''} />
        )}
      </Header>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
}
