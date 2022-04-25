import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { ReactNode } from 'react'
import { Menu as UiMenu, MenuTheme, mq } from 'ui'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'
import { LanguagePicker } from './LanguagePicker'

export const WRAPPER_HEIGHT = '5rem'
export const MOBILE_WRAPPER_HEIGHT = '4.5rem'

const MenuWrapper = styled.div({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',

  width: '100%',
  backgroundColor: colorsV3.gray900,

  [mq.md]: {
    height: WRAPPER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: 'auto',
    backgroundColor: 'initial',
  },
})

const ScrollableContainer = styled.div({
  overflowY: 'scroll',

  padding: `${MOBILE_WRAPPER_HEIGHT} 0.5rem 7rem 0.5rem`,

  [mq.md]: {
    overflow: 'initial',
    padding: `0`,
  },
})

type MenuProps = {
  theme: MenuTheme
  items: StoryblokMenuItem[]

  cta: ReactNode
  id?: string
}

export const Menu = ({ items, theme, cta, id }: MenuProps) => {
  return (
    <MenuWrapper id={id}>
      <ScrollableContainer>
        <UiMenu theme={theme}>
          {items.map((item) => {
            if (item.menu_items) {
              return (
                <UiMenu.SubMenu key={item._uid} title={item.label} href={item?.link?.cached_url}>
                  {item.menu_items.map((subItem) => {
                    return (
                      <UiMenu.Item key={subItem._uid} href={subItem.link.cached_url}>
                        {subItem.label}
                      </UiMenu.Item>
                    )
                  })}
                </UiMenu.SubMenu>
              )
            }

            if (item.menu_item_groups) {
              return (
                <UiMenu.SubMenu key={item._uid} title={item.label} href={item?.link?.cached_url}>
                  <UiMenu.GroupContainer>
                    {item.menu_item_groups.map((group) => {
                      return (
                        <UiMenu.ItemGroup
                          href={group.link?.cached_url}
                          title={group.label}
                          key={group._uid}
                        >
                          {group.menu_items.map((menuItem) => {
                            return (
                              <UiMenu.Item key={menuItem._uid} href={menuItem.link.cached_url}>
                                {menuItem.label}
                              </UiMenu.Item>
                            )
                          })}
                        </UiMenu.ItemGroup>
                      )
                    })}
                  </UiMenu.GroupContainer>
                </UiMenu.SubMenu>
              )
            }

            return (
              <UiMenu.Item key={item._uid} href={item.link.cached_url}>
                {item.label}
              </UiMenu.Item>
            )
          })}

          <UiMenu.Item>
            <LanguagePicker theme={theme} />
          </UiMenu.Item>
          {cta && <UiMenu.Item>{cta}</UiMenu.Item>}
        </UiMenu>
      </ScrollableContainer>
    </MenuWrapper>
  )
}
