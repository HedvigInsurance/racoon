import styled from '@emotion/styled'
import { ReactNode } from 'react'
// import AnimateHeight from 'react-animate-height'
import { MenuTheme } from 'ui/src/components/Menu/Menu'
import { getColor } from 'ui/src/lib/theme'
import { Menu, mq } from 'ui'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'
import { MOBILE_WRAPPER_HEIGHT } from '../PageHeaderBlock/PageHeaderBlock'
import { LanguagePicker } from './LanguagePicker'

const TRANSITION_TIME = 250

const AnimateHeight = styled.div<{height: string | number  }>(({height}) => ({
  height: height,
  maxHeight: '200vh',
  transition: `max-height ${TRANSITION_TIME}ms`,
  overflow: 'hidden',
}))
//  duration={TRANSITION_TIME} height={isOpen ? '100%' : 0}>

const MenuWrapper = styled.div<{ theme: MenuTheme }>(({ theme }) => ({
  // height: '100vh',
  // position: 'absolute',
  // left: 0,
  // right: 0,
  // bottom: 0,
  // top: 0,
  backgroundColor: getColor('dark'),
  paddingTop: MOBILE_WRAPPER_HEIGHT,
}))

const AdditionalItem = styled.div({
  marginLeft: '1rem',

  [mq.md]: {
    marginLeft: '2rem',
    marginRight: '2rem',
  },
})

type MenuBlockProps = {
  theme: MenuTheme
  items: StoryblokMenuItem[]
  isOpen?: boolean

  cta: ReactNode
}

export const MenuBlock = ({ items, theme, isOpen, cta }: MenuBlockProps) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }

  return (
    <AnimateHeight height={isOpen ? '100vh' : 0}>
      <MenuWrapper theme={theme}>
        <Menu theme={theme}>
          {items.map((item) => {
            if (item.menu_items) {
              return (
                <Menu.SubMenu key={item._uid} title={item.label}>
                  {item.menu_items.map((subItem) => {
                    return <Menu.Item key={subItem._uid}>{subItem.label}</Menu.Item>
                  })}
                </Menu.SubMenu>
              )
            }

            if (item.menu_item_groups) {
              return (
                <Menu.SubMenu key={item._uid} title={item.label}>
                  <Menu.GroupContainer>
                    {item.menu_item_groups.map((group) => {
                      return (
                        <Menu.ItemGroup title={group.label} key={group._uid}>
                          {group.menu_items.map((menuItem) => {
                            return <Menu.Item key={menuItem._uid}>{menuItem.label}</Menu.Item>
                          })}
                        </Menu.ItemGroup>
                      )
                    })}
                  </Menu.GroupContainer>
                </Menu.SubMenu>
              )
            }

            return <Menu.Item key={item._uid}>{item.label}</Menu.Item>
          })}
        </Menu>
        <AdditionalItem>
          <LanguagePicker theme={theme} />
        </AdditionalItem>
        <AdditionalItem>{cta}</AdditionalItem>
      </MenuWrapper>
    </AnimateHeight>
  )
}
