import styled from '@emotion/styled'
import { ReactNode } from 'react'
// import AnimateHeight from 'react-animate-height'
import { MenuTheme } from 'ui/src/components/Menu/Menu'
import { useBreakpoint } from 'ui/src/lib/media-query'
import { getColor } from 'ui/src/lib/theme'
import { Menu, mq } from 'ui'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'
import { MOBILE_WRAPPER_HEIGHT } from '../PageHeaderBlock/PageHeaderBlock'
import { LanguagePicker } from './LanguagePicker'

const TRANSITION_TIME = 250

// This could probably be refactored into ui/Menu for its collapsible prop
const AnimateHeight = styled.div<{ height: string | number }>(({ height }) => ({
  height: 'auto',
  maxHeight: height,
  transition: `max-height ${TRANSITION_TIME}ms`,
  // This is what hides the content when height is 0
  overflow: height === 0 ? 'hidden' : 'scroll',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,

  [mq.md]: {
    position: 'initial',
    overflow: 'hidden',
  },
}))

const MenuWrapper = styled.div({
  backgroundColor: getColor('dark'),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: `${MOBILE_WRAPPER_HEIGHT} 0.5rem 7rem 0.5rem`,

  [mq.md]: {
    backgroundColor: 'transparent',
    paddingTop: 0,
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 'initial',

    overflowY: 'hidden',
  },
})

const AdditionalItem = styled.div({
  marginLeft: '1rem',

  [mq.md]: {
    marginLeft: '2rem',
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

  // Only scroll menu on mobile, not entire page
  if (isOpen && !isDesktop) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'initial'
  }

  return (
    <AnimateHeight height={isOpen ? '100vh' : 0}>
      <MenuWrapper>
        <Menu theme={theme}>
          {items.map((item) => {
            if (item.menu_items) {
              return (
                <Menu.SubMenu key={item._uid} title={item.label} href={item?.link?.cached_url}>
                  {item.menu_items.map((subItem) => {
                    return (
                      <Menu.Item key={subItem._uid}>
                        <Menu.Link href={subItem.link.cached_url}>{subItem.label}</Menu.Link>
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
                              <Menu.Item key={menuItem._uid}>
                                <Menu.Link href={menuItem.link.cached_url}>
                                  {menuItem.label}
                                </Menu.Link>
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
              <Menu.Item key={item._uid}>
                <Menu.Link href={item.link.cached_url}>{item.label}</Menu.Link>
              </Menu.Item>
            )
          })}

          <Menu.Item>
            <LanguagePicker theme={theme} />
          </Menu.Item>
          <Menu.Item>{cta}</Menu.Item>
        </Menu>
      </MenuWrapper>
    </AnimateHeight>
  )
}
