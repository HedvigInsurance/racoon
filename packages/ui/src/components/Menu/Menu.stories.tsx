import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { mq, useBreakpoint } from '../../lib/media-query'
import { BurgerButton } from '../BurgerButton/BurgerButton'
import { Button } from '../Button/button'
import { Menu, MenuProps } from './Menu'

export default {
  title: 'UI / Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Menu>

const Container = styled.div({
  [mq.md]: {
    maxWidth: '500px',
    margin: 'auto',
  },
})

const MenuItems = (props: MenuProps) => {
  const isDesktop = useBreakpoint('md')

  return (
    <>
      <Menu.SubMenu title="Försäkringar" href="/forsakringar">
        <Menu.GroupContainer>
          <Menu.ItemGroup title="Hemförsäkringar" href="/hemforsakringar">
            <Menu.Item href="/forsakringar">Hyresrätt</Menu.Item>
            <Menu.Item href="/forsakringar">Bostadsrätt</Menu.Item>
            <Menu.Item href="/forsakringar">Hus &amp; villa</Menu.Item>
            <Menu.Item href="/forsakringar">Student</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Tillval">
            <Menu.Item href="/olycksfall">Olycksfall</Menu.Item>
          </Menu.ItemGroup>
        </Menu.GroupContainer>
      </Menu.SubMenu>
      <Menu.SubMenu title="Varför Hedvig">
        <Menu.Item href="/forsakringar">Byt till oss</Menu.Item>
        <Menu.Item href="/forsakringar">Skadeanmälningar</Menu.Item>
        <Menu.Item href="/forsakringar">Välgörenhet</Menu.Item>
        <Menu.Item href="/forsakringar">Prissättning</Menu.Item>
      </Menu.SubMenu>

      <Menu.Item href="/appen">Hedvig-appen</Menu.Item>
      <Menu.SubMenu title="Hjälp">
        <Menu.Item href="/forsakringar">Kundservice</Menu.Item>
        <Menu.Item href="/forsakringar">Teckna via telefon</Menu.Item>
        <Menu.Item href="/forsakringar">FAQ</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item>
        <Button fullWidth={!isDesktop} variant="outlined" color={props.theme}>
          Sign up!
        </Button>
      </Menu.Item>
    </>
  )
}

const Template: ComponentStory<typeof Menu> = (props: MenuProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Container>
      {props.collapsible && (
        <BurgerButton color={props.theme} initialOpen={true} onClick={() => setIsOpen(!isOpen)} />
      )}
      <Menu {...props} isOpen={isOpen}>
        <MenuItems {...props} />
      </Menu>
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {}

export const Collapsible = Template.bind({})
Collapsible.args = {
  collapsible: true,
}
