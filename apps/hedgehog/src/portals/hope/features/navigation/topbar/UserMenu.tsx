import styled from '@emotion/styled'
import { FadeIn, useClickOutside, useDarkmode } from '@hedvig-ui'
import { useState, useRef } from 'react'
import {
  BoxArrowLeft,
  GearFill,
  MoonFill,
  SunFill,
  ThreeDots,
} from 'react-bootstrap-icons'
import { CircleButton } from './TopBar'
import Link from 'next/link'

const MenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const List = styled.ul`
  & {
    padding: 0;
  }

  &,
  & li {
    list-style: none;
    margin: 0;
  }

  position: absolute;
  z-index: 10;
  top: 45px;
  right: 0;

  width: 200px;
  border-radius: 8px;
  box-shadow: 0 8px 20px 0 rgba(34, 60, 80, 0.2);

  li:first-of-type {
    border-radius: 8px 8px 0 0;
  }

  li:last-of-type {
    border-radius: 0 0 8px 8px;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`

const Option = styled.li`
  cursor: pointer;
  background-color: ${({ theme }) => theme.backgroundLight};
  padding: 0 15px;

  height: 35px;

  display: flex;
  align-items: center;

  & span {
    margin-left: 1rem;
    font-size: 14px;
    line-height: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.accentLighter};
  }
`

const UserMenu = () => {
  const listRef = useRef(null)
  const [view, setView] = useState(false)
  const { isDarkmode, setIsDarkmode } = useDarkmode()

  const close = () => setView(false)
  const toggle = () => setView((prev) => !prev)

  useClickOutside(listRef, close)

  return (
    <MenuWrapper>
      <CircleButton onClick={toggle}>
        <ThreeDots />
      </CircleButton>

      {view && (
        <List ref={listRef}>
          <FadeIn duration={200}>
            <Option
              onClick={() => {
                close()
              }}
            >
              <Link href="/profile">
                <GearFill /> <span>Settings</span>
              </Link>
            </Option>
            <Option
              onClick={() => {
                setIsDarkmode(!isDarkmode)
                close()
              }}
            >
              {isDarkmode ? <SunFill /> : <MoonFill />}{' '}
              <span>{isDarkmode ? 'Light mode' : 'Dark mode'}</span>
            </Option>

            <Option
              onClick={() => {
                window.location.pathname = '/login/logout'
                close()
              }}
            >
              <BoxArrowLeft />
              <span>Logout</span>
            </Option>
          </FadeIn>
        </List>
      )}
    </MenuWrapper>
  )
}

export default UserMenu
