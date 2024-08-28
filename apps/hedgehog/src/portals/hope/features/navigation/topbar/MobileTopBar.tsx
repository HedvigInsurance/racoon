import styled from '@emotion/styled'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { CircleButton } from '@hope/features/navigation/topbar/TopBar'
import { GearFill, List, X } from 'react-bootstrap-icons'
import { UserStatusCard } from '@hope/features/navigation/sidebar/UserStatusCard'

import { useMyMarkets } from '@hope/common/hooks/use-my-markets'

import {
  Container,
  isExternalLinkAvailable,
  MenuGroup,
  MenuItem,
  MenuItemExternalLink,
  menuList,
  routes,
} from '@hope/common/components/layouts/SidebarLayout/Sidebar'

const Wrapper = styled.div`
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 1.5rem;
`

const Menu = styled.div`
  z-index: 11;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100%;

  padding: 1.5rem 2rem;

  background-color: ${({ theme }) => theme.foreground};

  overflow-y: scroll;

  .close-x {
    width: 2rem;
    height: 2rem;
    fill: white;
  }
`

export const MobileTopBar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { markets } = useMyMarkets()
  const router = useRouter()

  return (
    <>
      {showMenu && (
        <Menu>
          <div style={{ marginLeft: 'auto', marginBottom: '2rem' }}>
            <X className="close-x" onClick={() => setShowMenu(false)} />
          </div>
          <Container>
            {menuList.map((group) => (
              <MenuGroup key={group.map(({ title }) => title).join('')}>
                {group.map(({ title, path, Icon, external }) => {
                  const { pathname } = location
                  let isActive: boolean = pathname.includes(path)

                  if (pathname.includes('claims')) {
                    isActive = path === routes.claims
                  }

                  if (pathname.includes('profile') || pathname === '/') {
                    isActive = path === routes.dashborad
                  }

                  if (pathname.includes('members')) {
                    isActive = path === routes.search
                  }
                  if (!external) {
                    return (
                      <MenuItem
                        key={title}
                        className={isActive ? 'route-active' : ''}
                        href={path}
                      >
                        <Icon />
                        <span>{title}</span>
                      </MenuItem>
                    )
                  }

                  return isExternalLinkAvailable(path, markets) ? (
                    <MenuItemExternalLink
                      href={path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon />
                      <span>{title}</span>
                    </MenuItemExternalLink>
                  ) : null
                })}
              </MenuGroup>
            ))}
            <UserStatusCard />
          </Container>
        </Menu>
      )}
      <Wrapper>
        <CircleButton onClick={() => router.push('/profile')}>
          <GearFill />
        </CircleButton>
        <div style={{ marginLeft: '1rem' }} />
        <CircleButton onClick={() => setShowMenu(true)}>
          <List />
        </CircleButton>
      </Wrapper>
    </>
  )
}
