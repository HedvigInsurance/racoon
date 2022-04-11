import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'
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

const Template: ComponentStory<typeof Menu> = (props: MenuProps) => {
  const isDesktop = useBreakpoint('md')

  return (
    <Container>
      <Menu {...props}>
        <Menu.SubMenu title="Försäkringar" href="/forsakringar">
          <Menu.GroupContainer>
            <Menu.ItemGroup title="Hemförsäkringar" href="/hemforsakringar">
              <Menu.Item>
                <Menu.Link href="/forsakringar">Hyresrätt</Menu.Link>
              </Menu.Item>
              <Menu.Item>
                <Menu.Link href="/forsakringar">Bostadsrätt</Menu.Link>
              </Menu.Item>
              <Menu.Item>
                <Menu.Link href="/forsakringar">Hus &amp; villa</Menu.Link>
              </Menu.Item>
              <Menu.Item>
                <Menu.Link href="/forsakringar">Student</Menu.Link>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Tillval">
              <Menu.Item>
                <Menu.Link href="/olycksfall">Olycksfall</Menu.Link>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.GroupContainer>
        </Menu.SubMenu>
        <Menu.SubMenu title="Varför Hedvig">
          <Menu.Item>
            <Menu.Link href="/forsakringar">Byt till oss</Menu.Link>
          </Menu.Item>
          <Menu.Item>
            <Menu.Link href="/forsakringar">Skadeanmälningar</Menu.Link>
          </Menu.Item>
          <Menu.Item>
            <Menu.Link href="/forsakringar">Välgörenhet</Menu.Link>
          </Menu.Item>
          <Menu.Item>
            <Menu.Link href="/forsakringar">Prissättning</Menu.Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item>
          <Menu.Link href="/appen">Hedvig-appen</Menu.Link>
        </Menu.Item>
        <Menu.SubMenu title="Hjälp">
          <Menu.Item>
            <Menu.Link href="/forsakringar">Kundservice</Menu.Link>
          </Menu.Item>
          <Menu.Item>
            <Menu.Link href="/forsakringar">Teckna via telefon</Menu.Link>
          </Menu.Item>
          <Menu.Item>
            <Menu.Link href="/forsakringar">FAQ</Menu.Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>
          <Button fullWidth={!isDesktop} variant="outlined">
            Sign up!
          </Button>
        </Menu.Item>
      </Menu>
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {}

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
Collapsible.args = {}
