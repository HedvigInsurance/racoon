import styled from '@emotion/styled'
import { Flex, withFadeIn } from '@hedvig-ui'
import chroma from 'chroma-js'
import { differenceInSeconds, parseISO } from 'date-fns'
import { useMe } from '@hope/features/user/hooks/use-me'
import * as React from 'react'
import { useUsers } from '@hope/features/user/hooks/use-users'
import { usePathname } from 'next/navigation'

const CircleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;

  :first-of-type {
    margin-left: 1.5rem;
  }

  :hover {
    .user-info {
      transition: all 250ms ease-in-out;
      max-width: 200px;
      opacity: 1;
      visibility: visible;
      margin-left: 0.5rem;
      margin-right: 1rem;
    }
  }

  .user-info {
    transition: all 250ms ease-in-out;
    max-width: 0;
    opacity: 0;
    visibility: hidden;
    margin-left: 0;
    margin-right: 0;
  }
`

const UserInfo = styled.div`
  text-align: left;
  color: ${({ theme }) => theme.placeholderColor};
  font-weight: normal;
  font-size: 0.9rem;
`

const UserCircle = withFadeIn(styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;

  margin-left: 0.5rem;

  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
  font-size: 1.2rem;

  background-color: ${({ theme }) => chroma(theme.accent).brighten(1).hex()};
`)

export const UsersOnPath: React.FC = () => {
  const pathname = usePathname()
  const { me } = useMe()
  const { users } = useUsers()

  const now = Date.now()

  const usersOnPath = (users ?? []).filter((user) => {
    if (user.email === me.email) {
      return false
    }
    if (user.latestLocation != pathname) {
      return false
    }
    return differenceInSeconds(now, parseISO(user.latestPresence)) <= 20
  })

  return (
    <Flex direction="row">
      {usersOnPath.map((user, index) => (
        <CircleContainer key={user.email}>
          <UserCircle delay={`${index * 40}ms`} duration={300}>
            {user.signature}
          </UserCircle>
          <UserInfo className="user-info">{user.email}</UserInfo>
        </CircleContainer>
      ))}
    </Flex>
  )
}
