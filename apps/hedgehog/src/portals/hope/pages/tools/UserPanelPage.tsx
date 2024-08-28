import { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'
import { Button, DateTimePicker, Flex, Input, Label } from '@hedvig-ui'
import { css } from '@emotion/react'
import { useUsers } from '../../features/user/hooks/use-users'
import { format, parseISO } from 'date-fns'
import { inTenMinutes, plusHours } from '../../features/config/utils/time'
import {
  UserDataFragment,
  usePauseUserDistributionMutation,
  useResumeUserDistributionMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'

gql`
  mutation PauseUserDistribution($email: String!, $until: Instant!) {
    pauseUserDistribution(email: $email, until: $until) {
      ...UserData
    }
  }
  mutation ResumeUserDistribution($email: String!) {
    resumeUserDistribution(email: $email) {
      ...UserData
    }
  }
`

type Status = 'checked-in' | 'checked-out' | 'vacationing'

export default function UserPanelPage() {
  const [search, setSearch] = useState('')
  const [statuses, setStatuses] = useState<Status[]>([])
  const { users } = useUsers()
  const applicableRoles = useMemo(
    () => ['IEX', 'SOS_INTERNATIONAL', 'CAR_TPA', 'ROOT'],
    [],
  )
  const applicableUsers = useMemo(
    () => users.filter(({ role }) => role && applicableRoles.includes(role)),
    [users, applicableRoles],
  )
  const filteredUsers = useMemo(() => {
    const statusUsers = statuses.length
      ? applicableUsers.filter((user) => {
          const userStatus = user.checkedIn
            ? 'checked-in'
            : user.distributionPausedUntil
              ? 'vacationing'
              : 'checked-out'

          return statuses.includes(userStatus)
        })
      : applicableUsers
    return statusUsers.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [applicableUsers, search, statuses])

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort(sortByStatus)
  }, [filteredUsers])

  function sortByStatus(a: UserDataFragment, b: UserDataFragment) {
    const aStatus = a.checkedIn
      ? 'checked-in'
      : a.distributionPausedUntil
        ? 'vacationing'
        : 'checked-out'
    const bStatus = b.checkedIn
      ? 'checked-in'
      : b.distributionPausedUntil
        ? 'vacationing'
        : 'checked-out'

    if (aStatus === bStatus) {
      return a.fullName.localeCompare(b.fullName)
    }
    if (aStatus === 'checked-in') {
      return -1
    }
    if (bStatus === 'checked-in') {
      return 1
    }
    if (aStatus === 'vacationing') {
      return -1
    }
    if (bStatus === 'vacationing') {
      return 1
    }
    return a.fullName.localeCompare(b.fullName)
  }

  const toggleStatus = (status: Status) => {
    if (statuses.includes(status)) {
      setStatuses(statuses.filter((s) => s !== status))
    } else {
      setStatuses([...statuses, status])
    }
  }

  return (
    <HopeAuthGuard
      requires={hopeAuthPermissions['back-office']['users:manage']}
    >
      <Wrapper>
        <Flex direction="column" gap="small">
          <StyledFilterContainer>
            <StyledFilterBar>
              <Flex gap="small">
                <div>
                  <Label>Search user</Label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Filter by status</Label>
                  <Flex gap="tiny">
                    <Button
                      onClick={() => toggleStatus('checked-in')}
                      variant={
                        statuses?.includes('checked-in')
                          ? 'primary'
                          : 'tertiary'
                      }
                    >
                      🔵 Checked In
                    </Button>
                    <Button
                      onClick={() => toggleStatus('checked-out')}
                      variant={
                        statuses?.includes('checked-out')
                          ? 'primary'
                          : 'tertiary'
                      }
                    >
                      🔴 Checked Out
                    </Button>
                    <Button
                      onClick={() => toggleStatus('vacationing')}
                      variant={
                        statuses?.includes('vacationing')
                          ? 'primary'
                          : 'tertiary'
                      }
                    >
                      🌴 Vacationing
                    </Button>
                  </Flex>
                </div>
              </Flex>
            </StyledFilterBar>
          </StyledFilterContainer>
          <StyledTableContainer>
            <StyledTableHeader>
              <span />
              <b>User</b>
              <b />
            </StyledTableHeader>

            {sortedUsers.map((user) => {
              return <TableRow key={user.id} user={user} />
            })}
          </StyledTableContainer>
        </Flex>
      </Wrapper>
    </HopeAuthGuard>
  )
}

const Wrapper = styled.div`
  padding: 0 2rem 2rem;
`

const StyledFilterContainer = styled.div`
  padding: 2rem 0 1rem;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: ${({ theme }) => theme.background};
`

const StyledFilterBar = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.backgroundLight};
`

const TableRow = ({ user }: { user: UserDataFragment }) => {
  const [pauseUserDistribution] = usePauseUserDistributionMutation()
  const [resumeUserDistribution] = useResumeUserDistributionMutation()
  const status = user.checkedIn
    ? '🔵'
    : user.distributionPausedUntil
      ? '🌴'
      : '🔴'
  const [isEditing, setIsEditing] = useState(false)
  const [distributionPausedUntil, setDistributionPausedUntil] = useState(
    user.distributionPausedUntil
      ? new Date(user.distributionPausedUntil)
      : null,
  )
  const pauseDistribution = async () => {
    if (!distributionPausedUntil) {
      return
    }
    toast.promise(
      pauseUserDistribution({
        variables: { email: user.email, until: distributionPausedUntil },
      }),
      {
        loading: 'Pausing distribution...',
        success: () => {
          setIsEditing(false)
          return 'Distribution paused!'
        },
        error: 'Failed to pause distribution',
      },
    )
  }
  const resumeDistribution = async () => {
    if (!user.distributionPausedUntil) {
      return
    }
    toast.promise(
      resumeUserDistribution({
        variables: { email: user.email },
      }),
      {
        loading: 'Resuming distribution...',
        success: () => {
          setIsEditing(false)
          return 'Distribution resumed!'
        },
        error: 'Failed to resume distribution',
      },
    )
  }

  useEffect(() => {
    if (user.distributionPausedUntil) {
      setDistributionPausedUntil(new Date(user.distributionPausedUntil))
    }
  }, [user.distributionPausedUntil])

  return (
    <StyledTableRow>
      <Flex justify="center" align="center">
        {status}
      </Flex>
      <span>{user.fullName}</span>
      <span>
        {user.checkedIn ? null : !isEditing ? (
          user.distributionPausedUntil ? (
            <Flex justify="space-between" align="flex-end" gap="tiny">
              <Flex direction="column">
                <Label>Distribution paused</Label>
                {new Date(user.distributionPausedUntil) < inTenMinutes
                  ? user.distributionPausedMinutes + ' minutes'
                  : format(
                      parseISO(user.distributionPausedUntil),
                      'dd MMMM, yyyy',
                    )}
              </Flex>
              <Flex justify="flex-end" gap="tiny">
                {new Date(user.distributionPausedUntil) > inTenMinutes && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Change
                  </Button>
                )}
                <Button status="success" onClick={resumeDistribution}>
                  Resume
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Set user away
            </Button>
          )
        ) : (
          <Flex direction="column">
            <Label>Pause distribution until</Label>
            <Flex gap="tiny">
              <DateTimePicker
                date={distributionPausedUntil ?? null}
                minDate={plusHours(new Date(), 24)}
                setDate={(date) => setDistributionPausedUntil(date)}
              />
              <Button
                disabled={!distributionPausedUntil}
                variant="secondary"
                onClick={pauseDistribution}
              >
                Set
              </Button>
              <Button variant="tertiary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        )}
      </span>
    </StyledTableRow>
  )
}

const StyledTableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.backgroundLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
`

const StyledTableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 2fr;

  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  > * {
    height: 44px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
  }
`

const StyledTableRow = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 100px 1fr 2fr;

    &:hover {
      background-color: ${theme.backgroundLight};
    }

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.border};
    }

    > * {
      padding: 10px 16px;
      display: flex;
      align-items: center;
    }

    position: relative;
  `,
)
