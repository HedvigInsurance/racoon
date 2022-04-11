import { Menu } from 'ui'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'

type MenuBlockProps = {
  items: StoryblokMenuItem[]
}

export const MenuBlock = ({ items }: MenuBlockProps) => {
  return (
    <Menu>
      {items.map((item) => {
        if (item.menu_items) {
          return (
            <Menu.SubMenu title={item.label}>
              {item.menu_items.map((subItem) => {
                return <Menu.Item key={subItem._uid}>{subItem.label}</Menu.Item>
              })}
            </Menu.SubMenu>
          )
        }

        if (item.menu_item_groups) {
          return (
            <Menu.SubMenu title={item.label}>
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
  )
}
