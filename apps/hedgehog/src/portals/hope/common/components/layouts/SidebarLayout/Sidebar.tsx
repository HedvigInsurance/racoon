'use client'

import { useEffect } from 'react'
import * as React from 'react'
import styled, { StyledComponent } from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import {
  ArrowUpRight,
  ChevronLeft,
  House,
  Inbox,
  Search,
  ShieldShaded,
  Tools,
} from 'react-bootstrap-icons'
import { useMyMarkets } from '@hope/common/hooks/use-my-markets'
import { Key, Keys } from '@hedvig-ui'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import { theme } from '@hedvig-ui/redesign/theme'
import { useSidebarLayout } from '@hope/common/components/layouts/SidebarLayout'
import { Market } from '@hope/features/config/constants'
import { HopeIcon as HopeIconSVG } from '@hope/features/navigation/sidebar/elements'
import { usePathname } from 'next/navigation'
import { UserStatusCard } from '@hope/features/navigation/sidebar/UserStatusCard'
import Link from 'next/link'

const Wrapper = styled.aside<{ collapsed: boolean }>`
  position: relative;
  z-index: 8;

  width: ${({ collapsed }) =>
    collapsed ? theme.sidebarWidth.collapsed : theme.sidebarWidth.expanded};
  height: 100%;

  padding: ${({ collapsed }) =>
    collapsed ? 0 : '2.75rem 1.875rem 1.5rem 1.875rem'};

  background: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900};

  &,
  & a {
    transition: all 300ms;
  }

  ${({ collapsed }) =>
    collapsed &&
    `
    & a {
      opacity: 0;
    }
  `}
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.5rem;

  width: 100%;
  height: 100%;

  background: transparent;
`

const CollapseToggler = styled.button<{ collapsed?: boolean }>`
  background: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900};
  height: calc(0.75rem + 1.5rem);
  width: 1.5rem;
  position: absolute;
  top: 1rem;
  transform: translateX(100%);
  right: 0;
  color: #fff;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0;
  border: 0;
  border-left-color: transparent;
  z-index: 9;

  && > * {
    transition: transform 300ms;
    transform: ${({ collapsed }) => `rotate(${collapsed ? 180 : 0}deg)`};
    margin: 0;
    width: 0.75rem;
    height: 0.75rem;
  }
`

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`

const HopeIcon = styled(HopeIconSVG)`
  width: 6rem;
  transition: all 300ms;
  fill: ${colorsV3.gray100};
`

export const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const MenuItem = styled(Link)`
  position: relative;

  display: flex;
  align-items: center;
  gap: 15px;

  &.route-active {
    & span {
      color: ${({ theme }) =>
        theme.type === 'dark' ? theme.foreground : theme.backgroundLight};
    }

    & svg {
      fill: ${({ theme }) =>
        theme.type === 'dark' ? theme.foreground : theme.backgroundLight};
    }
  }

  & span {
    font-size: 16px;
    line-height: 19px;
    white-space: nowrap;
    color: ${({ theme }) =>
      theme.type === 'dark' ? theme.placeholderColor : theme.placeholderColor};
    transition: color 100ms !important;
  }

  & svg {
    width: 16px;
    fill: ${({ theme }) => theme.placeholderColor};
    transition: fill 100ms !important;
  }
`

export const MenuItemExternalLink = MenuItem.withComponent(
  'a',
) as StyledComponent<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
>

export enum routes {
  dashborad = '/dashborad',
  claims = '/claims/list/1',
  inbox = '/inbox',
  search = '/search/members',
  tools = '/tools',
  trustly = 'https://backoffice.trustly.com/?Locale=en_GB#/tab_orders',
  adyen = 'https://ca-live.adyen.com',
  gsr = 'https://app.gsr.se/Account/SignIn',
  foss = 'https://foss.finansnorge.no/#/account/login',
}

interface MenuListType {
  name: string
  title: string
  path: routes
  key: Key
  Icon: React.ElementType
  external?: boolean
}

export const menuList: MenuListType[][] = [
  [
    {
      name: 'dashborad',
      title: 'Dashborad',
      path: routes.dashborad,
      key: Keys.D,
      Icon: House,
    },
    {
      name: 'search',
      title: 'Search',
      path: routes.search,
      key: Keys.S,
      Icon: Search,
    },
  ],
  [
    {
      name: 'inbox',
      title: 'Inbox',
      path: routes.inbox,
      key: Keys.I,
      Icon: Inbox,
    },
    {
      name: 'claims',
      title: 'Claims',
      path: routes.claims,
      key: Keys.C,
      Icon: ShieldShaded,
    },
    {
      name: 'tools',
      title: 'Tools',
      path: routes.tools,
      key: Keys.T,
      Icon: Tools,
    },
  ],
]

const menuExternalList: MenuListType[] = [
  {
    name: 'trustly',
    title: 'Trustly',
    path: routes.trustly,
    key: Keys.R,
    Icon: ArrowUpRight,
    external: true,
  },
  {
    name: 'adyen',
    title: 'Adyen',
    path: routes.adyen,
    key: Keys.A,
    Icon: ArrowUpRight,
    external: true,
  },
  {
    name: 'gsr',
    title: 'GSR',
    path: routes.gsr,
    key: Keys.G,
    Icon: ArrowUpRight,
    external: true,
  },
  {
    name: 'foss',
    title: 'Foss',
    path: routes.foss,
    key: Keys.F,
    Icon: ArrowUpRight,
    external: true,
  },
]

export const isExternalLinkAvailable = (path: string, markets: Market[]) => {
  const isSwedenMarket = markets.includes(Market.Sweden)
  const isNorwayMarket = markets.includes(Market.Norway)
  const isDenmarkMarket = markets.includes(Market.Denmark)

  const isTrustly = path === routes.trustly
  const isAdyen = path === routes.adyen
  const isGSR = path === routes.gsr
  const isFoss = path === routes.foss

  if (isSwedenMarket && (isTrustly || isGSR)) {
    return true
  }

  if (isNorwayMarket && (isFoss || isAdyen)) {
    return true
  }

  if (isDenmarkMarket && isAdyen) {
    return true
  }

  return false
}

export const Sidebar = () => {
  const { hasPermission: hasToolsPermission } =
    useHasPermission('navigateTools')
  const { hasPermission: hasInboxPermission } =
    useHasPermission('navigateInbox')

  const { markets } = useMyMarkets()

  const filteredMenuList = menuList.map((items) =>
    items.filter((item) => {
      switch (item.name) {
        case 'tools':
          return hasToolsPermission
        case 'inbox':
          return hasInboxPermission
        default:
          return true
      }
    }),
  )

  const filteredExternalMenuList = menuExternalList.filter((item) =>
    isExternalLinkAvailable(item.path, markets),
  )

  const { collapsed, toggle, temporaryView, setTemporaryView } =
    useSidebarLayout()

  const pathname = usePathname()

  useEffect(() => {
    if (!collapsed) {
      return
    }

    setTemporaryView((temporaryView) => {
      if (temporaryView) {
        return false
      }

      return temporaryView
    })
  }, [collapsed, setTemporaryView])

  if (!markets) {
    return null
  }

  return (
    <Wrapper
      collapsed={collapsed && !temporaryView}
      onMouseLeave={() => {
        if (collapsed) {
          setTemporaryView(false)
        }
      }}
    >
      <CollapseToggler collapsed={collapsed && !temporaryView} onClick={toggle}>
        <ChevronLeft />
      </CollapseToggler>

      <Container
        onMouseEnter={() => {
          if (collapsed) {
            setTemporaryView(true)
          }
        }}
      >
        {(!collapsed || temporaryView) && (
          <>
            {filteredMenuList.map((group, index) => (
              <MenuGroup key={group.length + index}>
                {group.map((item) => {
                  const Icon = item.Icon

                  let isActive: boolean = pathname.includes(item.path)

                  if (pathname.includes('claims')) {
                    isActive = item.path === routes.claims
                  }

                  if (pathname.includes('profile') || pathname === '/') {
                    isActive = item.path === routes.dashborad
                  }

                  if (pathname.includes('members')) {
                    isActive = item.path === routes.search
                  }

                  return (
                    <MenuItem
                      key={item.title}
                      className={isActive ? 'route-active' : ''}
                      href={item.path}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </MenuItem>
                  )
                })}
              </MenuGroup>
            ))}
            <MenuGroup>
              {filteredExternalMenuList.map(({ title, path, Icon }) => (
                <MenuItemExternalLink
                  key={title}
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon />
                  <span>{title}</span>
                </MenuItemExternalLink>
              ))}
            </MenuGroup>
            {!collapsed && <UserStatusCard />}
            <Bottom>
              <HopeIcon />
            </Bottom>
          </>
        )}
      </Container>
    </Wrapper>
  )
}
