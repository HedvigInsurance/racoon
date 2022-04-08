import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { mq } from '../../lib/media-query'
import { BurgerButton } from '../BurgerButton/BurgerButton'
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

const defaultMenuItems = (
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
  </>
)

const Template: ComponentStory<typeof Menu> = (props: MenuProps) => {
  return (
    <Container>
      <Menu {...props} />
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {
  children: defaultMenuItems,
}

const CollapsibleTemplate: ComponentStory<typeof Menu> = (props: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Container>
      <BurgerButton onClick={() => setIsOpen(!isOpen)} />
      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <Menu {...props} />
      </AnimateHeight>
    </Container>
  )
}

export const Collapsible = CollapsibleTemplate.bind({})
Collapsible.args = {
  children: defaultMenuItems,
}
