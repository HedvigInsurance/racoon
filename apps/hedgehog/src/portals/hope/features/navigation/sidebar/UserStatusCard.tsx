import { useEffect, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import {
  Button,
  DateTimePicker,
  extractErrorMessage,
  Flex,
  Keys,
  Label,
  Popover,
  Spacing,
} from '@hedvig-ui'
import toast from 'react-hot-toast'
import { useUserStatus } from '@hope/features/tasks/hooks/use-user-status'
import { CommandHotkey } from '../../commands/components/CommandHotkey'
import { format } from 'date-fns'
import { css } from '@emotion/react'

const UserStatusWrapper = styled.div<{ checkedIn: boolean }>(
  ({ theme, checkedIn }) => css`
    padding: 1.2rem;
    background-color: ${checkedIn ? theme.accent : theme.accentSecondary};
    border-radius: 0.25rem;

    ${checkedIn &&
    css`
      color: ${theme.accentContrast};
    `}

    h4 {
      font-size: 1.3rem;
    }

    p {
      font-size: 1rem;
    }

    .n-questions {
      background-color: ${chroma(theme.accentContrast).alpha(0.15).hex()};
      color: ${theme.accentContrast};
      border-radius: 0.25rem;
      padding: 0.1rem 0.2rem;
    }
  `,
)

const BouncingOrb = styled.div<{
  status: 'checkout-paused' | 'distribution-paused' | 'checked-in'
}>`
  width: 1rem;
  @keyframes scaleIn {
    from {
      transform: scale(0.5, 0.5);
      opacity: 0.5;
    }
    to {
      transform: scale(2.5, 2.5);
      opacity: 0;
    }
  }

  .bouncing-orb {
    position: absolute;
    top: 0;
    left: 0;

    width: 0.75rem;
    height: 0.75rem;

    border-radius: 50%;

    animation: scaleIn 4s infinite cubic-bezier(0.36, 0.11, 0.89, 0.32);

    background-color: ${({ theme, status }) => {
      switch (status) {
        case 'checkout-paused':
          return theme.warning
        case 'distribution-paused':
          return theme.danger
        case 'checked-in':
        default:
          return theme.accentContrast
      }
    }};
  }
`

export const UserStatusCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const {
    checkIn,
    checkOut,
    checkedIn,
    taskDistributionPausedUntil,
    taskDistributionPausedMinutes,
    pauseUserCheckout,
    userCheckoutPausedMinutes,
    pauseTaskDistribution,
  } = useUserStatus()

  const pauseCheckoutHandler = () => {
    toast.promise(pauseUserCheckout(), {
      loading: 'Pausing automatic checkout...',
      success: 'Automatic checkout paused',
      error: ({ message }) => extractErrorMessage(message),
    })
  }

  const [extendedLeaveForm, setExtendedLeaveForm] = useState<Date | undefined>(
    taskDistributionPausedUntil
      ? new Date(taskDistributionPausedUntil)
      : undefined,
  )
  useEffect(() => {
    if (taskDistributionPausedUntil) {
      setExtendedLeaveForm(new Date(taskDistributionPausedUntil))
    }
  }, [taskDistributionPausedUntil])
  const [isEditingExtendedLeave, setIsEditingExtendedLeave] = useState(false)

  const status = taskDistributionPausedMinutes
    ? 'distribution-paused'
    : userCheckoutPausedMinutes
      ? 'checkout-paused'
      : 'checked-in'

  if (checkedIn) {
    return (
      <UserStatusWrapper checkedIn={checkedIn} {...props}>
        <Flex direction="column">
          <Flex justify="space-between" gap="small">
            <div>
              {status === 'distribution-paused' && (
                <>
                  <h4>Assignments stopped</h4>
                  <p>
                    No members will automatically be assigned to you during this
                    time period. Also, you will keep your currently assigned
                    ones.
                  </p>
                  <p>
                    Note: You will be automatically checked out when the timer
                    ends.
                  </p>
                </>
              )}
              {status === 'checkout-paused' && (
                <>
                  <h4>Away</h4>
                  <p>
                    You can now lock your computer without being checked out.
                    However, new members will still be assigned to you.
                  </p>
                  <p>
                    Note: You will be automatically checked out when the timer
                    ends.
                  </p>
                </>
              )}
              {status === 'checked-in' && (
                <>
                  <h4>You are checked-in</h4>
                  <p>Compatible members will be assigned to you.</p>
                </>
              )}
            </div>
            <BouncingOrb status={status}>
              <div
                style={{
                  position: 'relative',
                }}
              >
                <div
                  className="bouncing-orb"
                  style={{ animationDelay: '0s' }}
                />
                <div
                  className="bouncing-orb"
                  style={{ animationDelay: '1s' }}
                />
                <div
                  className="bouncing-orb"
                  style={{ animationDelay: '2s' }}
                />
                <div
                  className="bouncing-orb"
                  style={{ animationDelay: '3s' }}
                />
              </div>
            </BouncingOrb>
          </Flex>
          <Flex
            justify="space-between"
            style={{ marginTop: '1rem' }}
            gap="small"
          >
            <CommandHotkey
              text="Check out"
              keys={[Keys.Option, Keys.Backspace]}
              onResolve={checkOut}
              side="left"
            >
              <Button variant="secondary" onClick={() => checkOut()}>
                Check out
              </Button>
            </CommandHotkey>
            {taskDistributionPausedMinutes ? (
              <Popover contents="Remove stop">
                <Button onClick={checkIn} status="danger">
                  ⤫ {taskDistributionPausedMinutes} min
                </Button>
              </Popover>
            ) : userCheckoutPausedMinutes ? (
              <Popover contents="Remove away">
                <Button onClick={checkIn} status="warning">
                  ⤫ {userCheckoutPausedMinutes} min
                </Button>
              </Popover>
            ) : (
              <Popover contents="No automatic checkout for 30 minutes">
                <Button variant="primary" onClick={pauseCheckoutHandler}>
                  Away
                </Button>
              </Popover>
            )}
          </Flex>
        </Flex>
      </UserStatusWrapper>
    )
  }

  if (taskDistributionPausedUntil) {
    return (
      <UserStatusWrapper checkedIn={checkedIn} {...props}>
        <Flex direction="column">
          <Flex justify="space-between" gap="small">
            <div>
              <h4>Extended Leave</h4>

              {isEditingExtendedLeave ? (
                <>
                  <Label>When will you be back?</Label>
                  <DateTimePicker
                    date={extendedLeaveForm ?? null}
                    setDate={setExtendedLeaveForm}
                  />
                  <Spacing top="small" />
                  <Flex justify="space-between">
                    <Button
                      variant="secondary"
                      disabled={!extendedLeaveForm}
                      onClick={() => {
                        if (extendedLeaveForm) {
                          pauseTaskDistribution(extendedLeaveForm)
                        }
                        setIsEditingExtendedLeave(false)
                      }}
                    >
                      Set date
                    </Button>
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setIsEditingExtendedLeave(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              ) : (
                <>
                  <p>
                    <b>{format(taskDistributionPausedUntil, 'dd MMMM yyyy')}</b>
                  </p>
                  <p>No members will be assigned to you during this period.</p>
                  <p>
                    Claims you are exclusively assigned to will be reassigned to
                    checked in users.
                  </p>
                  <Flex justify="space-between">
                    <Popover contents="Change time of leave">
                      <Button onClick={() => setIsEditingExtendedLeave(true)}>
                        Edit
                      </Button>
                    </Popover>
                    <Popover contents="Remove leave">
                      <Button
                        onClick={() => {
                          if (checkedIn) {
                            checkIn()
                          } else {
                            checkOut()
                          }
                        }}
                        status="success"
                      >
                        I'm back
                      </Button>
                    </Popover>
                  </Flex>
                </>
              )}
            </div>
          </Flex>
        </Flex>
      </UserStatusWrapper>
    )
  }

  return null
}
