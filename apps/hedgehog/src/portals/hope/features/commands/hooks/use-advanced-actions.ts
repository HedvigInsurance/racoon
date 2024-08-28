import { differenceInSeconds, parseISO } from 'date-fns'
import { ArrayElement } from '@hedvig-ui'
import { useOldMemberSearch } from '@hope/features/members-search/hooks/use-old-member-search'
import { useMe } from '@hope/features/user/hooks/use-me'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsersQuery, useUsersQuery } from 'types/generated/graphql'
import { CommandLineAction } from '@hope/features/commands/hooks/use-command-line'

const getFilteredUsers = (
  searchValue: string,
  users: UsersQuery['users'],
  myEmail: string,
) => {
  const name = searchValue.split('@')[searchValue.split('@').length - 1]

  return (
    users?.filter(
      (user) =>
        user.email !== myEmail &&
        user.fullName.toLowerCase().includes(name.toLowerCase()),
    ) ?? []
  )
}

const getOnlineUsers = (
  searchValue: string,
  users: UsersQuery['users'],
  myEmail: string,
) => {
  const now = new Date()

  const filteredUsers = getFilteredUsers(searchValue, users, myEmail)

  return filteredUsers
    .filter((user) =>
      user.latestPresence
        ? differenceInSeconds(now, parseISO(user.latestPresence)) <= 20
        : false,
    )
    .sort((u1, u2) =>
      u1.fullName.toLowerCase() > u2.fullName.toLowerCase() ? 1 : -1,
    )
}

export const useAdvancedActions = (
  searchValue: string,
  onChange: (value: string) => void,
  setResult: (value: CommandLineAction[]) => void,
  onHide: () => void,
) => {
  const navigate = useNavigate()

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [{ members }, memberSearch, { loading: membersLoading }] =
    useOldMemberSearch()

  const advancedActions: CommandLineAction[] = useMemo(
    () => [
      {
        label: 'Go to User',
        onResolve: () => onChange('/goto @'),
      },
      {
        label: 'Search Members',
        onResolve: () => onChange('/search @'),
      },
    ],
    [onChange],
  )

  const setUsersAsOptions = useCallback(
    (
      users: UsersQuery['users'],
      action: (value: ArrayElement<UsersQuery['users']>) => void,
      field: keyof ArrayElement<UsersQuery['users']>,
    ) => {
      setResult(
        users.map((user) => ({
          label: user[field],
          onResolve: () => {
            action(user)
          },
        })),
      )
    },
    [setResult],
  )

  const handleToUser = useCallback(
    (user: ArrayElement<UsersQuery['users']>) => {
      const hasCurrentLocation = !!user.latestLocation && user.email !== myEmail

      if (hasCurrentLocation && user.latestLocation) {
        navigate(user?.latestLocation)
      }
    },
    [myEmail, navigate],
  )

  const handleToMember = useCallback(
    (id: string) => {
      const link = `/members/${id}/contracts`

      navigate(link)
    },
    [navigate],
  )

  const searchMembers = useCallback(() => {
    const name = searchValue.split('@')[searchValue.split('@').length - 1]
    memberSearch(name || '%', { pageSize: 10 })
  }, [memberSearch, searchValue])

  useEffect(() => {
    if (!searchValue.includes('@') && searchValue[0] === '/') {
      setResult(
        advancedActions.filter((act) =>
          `/${act.label}`.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )

      return
    }

    if (searchValue.includes('/goto')) {
      setUsersAsOptions(
        getOnlineUsers(searchValue, data?.users ?? [], myEmail),
        (user) => {
          handleToUser(user)
          onHide()
        },
        'fullName',
      )
    }

    if (searchValue.includes('/search')) {
      searchMembers()
    }
  }, [
    searchValue,
    advancedActions,
    data?.users,
    handleToUser,
    myEmail,
    onHide,
    searchMembers,
    setResult,
    setUsersAsOptions,
  ])

  useEffect(() => {
    if ((!membersLoading && !members.length) || membersLoading) {
      setResult([
        {
          label: membersLoading ? 'Loading...' : 'Empty',
          onResolve: () => {
            return
          },
        },
      ])

      return
    }

    setResult(
      members.map((member) => ({
        label: `${member.firstName} ${member.lastName}`,
        onResolve: () => {
          handleToMember(member.memberId)
          onHide()
        },
      })),
    )
  }, [
    members.length,
    membersLoading,
    handleToMember,
    members,
    onHide,
    setResult,
  ])
}
