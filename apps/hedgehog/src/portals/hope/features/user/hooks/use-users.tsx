import gql from 'graphql-tag'
import * as React from 'react'
import { createContext, PropsWithChildren, useContext } from 'react'
import { UserDataFragment, useUsersQuery } from 'types/generated/graphql'

interface UsersContextProps {
  users: ReadonlyArray<UserDataFragment>
  checkedInUsers: ReadonlyArray<UserDataFragment>
}

gql`
  query Users {
    users {
      ...UserData
    }
  }

  fragment UserData on User {
    id
    fullName
    signature
    role
    email
    latestPresence
    latestLocation
    distributionPausedMinutes
    distributionPausedUntil
    checkoutPausedMinutes
    checkedIn
    markets
    resources
    areas
  }
`

const UsersContext = createContext<UsersContextProps | null>(null)

export const useUsers = () => {
  const context = useContext(UsersContext)

  if (!context) {
    throw Error('useUsers must be used inside UserProvider')
  }

  return context
}

export const UsersProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useUsersQuery({
    pollInterval: 10_000,
  })
  const users = (data?.users ?? []) as ReadonlyArray<UserDataFragment>
  const checkedInUsers = users.filter((user) => user.checkedIn)

  return (
    <UsersContext.Provider
      value={{
        users,
        checkedInUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
