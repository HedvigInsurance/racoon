import styled from '@emotion/styled'
import { Flex, Navigation } from '@hedvig-ui'
import { UsersOnPath } from '@hope/features/navigation/topbar/components/UsersOnPath'
import { UserPanel } from '@hope/features/user/UserPanel'
import { useState } from 'react'
import * as React from 'react'
import { PeopleFill } from 'react-bootstrap-icons'
import UserMenu from './UserMenu'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useMe } from '@hope/features/user/hooks/use-me'
import Link from 'next/link'

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 2rem;
`

export const CircleButtonStyles = styled(motion.button)`
  width: 2.5rem;
  height: 2.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.accentLighter};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.accentLight};
  }

  & > svg {
    width: 100%;

    pointer-events: none;
  }

  border: none;
`

export const CircleButton: React.FC<HTMLMotionProps<'button'>> = ({
  children,
  ...props
}) => (
  <CircleButtonStyles
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </CircleButtonStyles>
)

const TopBarContainer = styled(Flex)<{ pushLeft: boolean }>`
  gap: 1rem;

  transition: margin-right 400ms;
  margin-right: ${({ pushLeft }) => (pushLeft ? '300px' : '0')};
`

export const CircleNavigation = styled(Navigation)`
  border-radius: 50%;
`

const Username = styled(Link)`
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-right: -0.5rem;
`

export const TopBar = () => {
  const [showUsers, setShowUsers] = useState(false)
  const [closingUsers, setClosingUsers] = useState(false)

  const { me } = useMe()

  const closeUsersHandler = () => {
    setClosingUsers(true)
    setTimeout(() => {
      setShowUsers(false)
      setClosingUsers(false)
    }, 350)
  }

  return (
    <Wrapper>
      {showUsers && (
        <UserPanel closing={closingUsers} onClickOutside={closeUsersHandler} />
      )}
      <TopBarContainer
        pushLeft={showUsers && !closingUsers}
        direction="row"
        justify="flex-end"
        align="center"
      >
        <UsersOnPath />

        {!!me && (
          <>
            {!!me.taskDistributionPausedUntil && !me.checkedIn && (
              <Vacation href="/profile">Vacationing 🌴</Vacation>
            )}
            <Username href="/profile">{me.fullName}</Username>
          </>
        )}

        <CircleButton
          onClick={() => {
            PushUserAction('user_panel', 'open', null, null)
            setShowUsers(true)
          }}
        >
          <PeopleFill />
        </CircleButton>
        <UserMenu />
      </TopBarContainer>
    </Wrapper>
  )
}

const Vacation = styled(Link)`
  cursor: pointer;
`
