import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Menu, MenuTheme, mq, useBreakpoint } from 'ui'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'
import { LanguagePicker } from './LanguagePicker'

export const MOBILE_WRAPPER_HEIGHT = '4.5rem'

const MenuWrapper = styled.div({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',

  [mq.md]: {
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const ScrollableContainer = styled.div({
  overflowY: 'scroll',

  padding: `${MOBILE_WRAPPER_HEIGHT} 0.5rem 7rem 0.5rem`,

  [mq.md]: {
    overflow: 'initial',
  },
})

type MenuBlockProps = {
  theme: MenuTheme
  items: StoryblokMenuItem[]
  isOpen?: boolean

  cta: ReactNode
}

export const MenuBlock = ({ items, theme, isOpen, cta }: MenuBlockProps) => {
  const isDesktop = useBreakpoint('md')

  if (typeof document !== 'undefined') {
    // Only scroll menu on mobile, not entire page
    if (isOpen && !isDesktop) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'initial'
    }
  }

  return (
    <MenuWrapper>
      <ScrollableContainer>
        <Menu theme={theme} collapsible={!isDesktop} isOpen={isOpen}>
          {items.map((item) => {
            if (item.menu_items) {
              return (
                <Menu.SubMenu key={item._uid} title={item.label} href={item?.link?.cached_url}>
                  {item.menu_items.map((subItem) => {
                    return (
                      <Menu.Item key={subItem._uid} href={subItem.link.cached_url}>
                        {subItem.label}
                      </Menu.Item>
                    )
                  })}
                </Menu.SubMenu>
              )
            }

            if (item.menu_item_groups) {
              return (
                <Menu.SubMenu key={item._uid} title={item.label} href={item?.link?.cached_url}>
                  <Menu.GroupContainer>
                    {item.menu_item_groups.map((group) => {
                      return (
                        <Menu.ItemGroup
                          href={group.link?.cached_url}
                          title={group.label}
                          key={group._uid}
                        >
                          {group.menu_items.map((menuItem) => {
                            return (
                              <Menu.Item key={menuItem._uid} href={menuItem.link.cached_url}>
                                {menuItem.label}
                              </Menu.Item>
                            )
                          })}
                        </Menu.ItemGroup>
                      )
                    })}
                  </Menu.GroupContainer>
                </Menu.SubMenu>
              )
            }

            return (
              <Menu.Item key={item._uid} href={item.link.cached_url}>
                {item.label}
              </Menu.Item>
            )
          })}

          <Menu.Item>
            <LanguagePicker theme={theme} />
          </Menu.Item>
          {cta && <Menu.Item>{cta}</Menu.Item>}
        </Menu>
      </ScrollableContainer>
    </MenuWrapper>
  )
}
