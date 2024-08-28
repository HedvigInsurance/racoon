import {
  Button,
  Card,
  Checkbox,
  convertEnumOrSentenceToTitle,
  DateTimePicker,
  Flex,
  Input,
  Label,
  MainHeadline,
  Paragraph,
  Popover,
  RadioGroup,
  Spacing,
  ThirdLevelHeadline,
  useConfirmDialog,
  useTitle,
} from '@hedvig-ui'
import { AvailablePortals } from 'auth/components/AvailablePortals'
import { useMyMarkets } from '@hope/common/hooks/use-my-markets'
import { Market, MarketFlags } from '@hope/features/config/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useUpdateUserMutation } from 'types/generated/graphql'
import { useMe } from '../../features/user/hooks/use-me'
import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useUserStatus } from '../../features/tasks/hooks/use-user-status'

const Wrapper = styled.div`
  padding: 2rem;
`

const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<null | string>('')
  const [updateUser] = useUpdateUserMutation()
  const { markets, addMarket, removeMarket } = useMyMarkets()

  const { me } = useMe()
  const portals = me.availablePortals ?? []
  const currentPortal = me.portal ?? ''
  const taskDistributionPausedUntil = me.taskDistributionPausedUntil

  const handleSaveChanges = () => {
    toast.promise(
      updateUser({
        variables: {
          input: {
            fullName,
            phoneNumber,
          },
        },
        optimisticResponse: {
          updateUser: {
            __typename: 'User',
            ...me.user,
            fullName,
            phoneNumber,
          },
        },
      }),
      {
        loading: 'Updating user',
        success: 'User updated',
        error: 'Could not update user',
      },
    )
  }

  const reset = useCallback(() => {
    setFullName(me.user.fullName ?? '')
    setPhoneNumber(me.user.phoneNumber ?? null)
  }, [me.user.fullName, me.user.phoneNumber])

  useEffect(reset, [reset])

  useTitle('Profile')

  const { checkedIn, checkIn, checkOut, pauseTaskDistribution } =
    useUserStatus()
  const [status, setStatus] = useState<'ACTIVE' | 'VACATION'>(() => {
    if (checkedIn) {
      return 'ACTIVE'
    }
    if (taskDistributionPausedUntil) {
      return 'VACATION'
    }
    return 'ACTIVE'
  })
  const [extendedLeaveForm, setExtendedLeaveForm] = useState<Date | undefined>(
    taskDistributionPausedUntil
      ? new Date(taskDistributionPausedUntil)
      : undefined,
  )
  const [manualEditingExtendedLeave, setManualEditingExtendedLeave] =
    useState(false)

  const isEditingExtendedLeave = useMemo(() => {
    if (manualEditingExtendedLeave) {
      return true
    }
    if (status === 'VACATION') {
      if (!checkedIn && !taskDistributionPausedUntil) {
        return true
      }
    }
    return false
  }, [
    manualEditingExtendedLeave,
    status,
    taskDistributionPausedUntil,
    checkedIn,
  ])

  useEffect(() => {
    if (!taskDistributionPausedUntil) {
      setStatus('ACTIVE')
    } else {
      setStatus('VACATION')
      setExtendedLeaveForm(new Date(taskDistributionPausedUntil))
    }
  }, [taskDistributionPausedUntil])

  const { confirm } = useConfirmDialog()

  const handleUserBackFromVacation = () => {
    if (checkedIn) {
      checkIn()
    } else {
      checkOut()
    }
    setStatus('ACTIVE')
    setManualEditingExtendedLeave(false)
  }

  const changes =
    fullName !== me.user.fullName || phoneNumber !== me.user.phoneNumber

  return (
    <Wrapper>
      <MainHeadline>Settings</MainHeadline>
      <div>
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Flex direction="column">
            <form
              style={{ width: '100%', maxWidth: '350px' }}
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveChanges()
              }}
            >
              <ThirdLevelHeadline>Profile</ThirdLevelHeadline>
              <Label>Full name</Label>

              <Input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
              />

              <Spacing top="small" />
              <Label>Phone</Label>
              <Input
                placeholder="+46701234567"
                value={phoneNumber ?? ''}
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              />

              <Spacing top="small" />
              <Label>E-mail</Label>
              <Input
                disabled
                muted={true}
                value={me.user.email}
                placeholder="example@hedvig.com"
              />
              <Spacing top="medium" />
              <Flex direction="row">
                <Button type="submit" disabled={!changes || !fullName}>
                  Save changes
                </Button>
              </Flex>
            </form>
          </Flex>

          {!checkedIn && (
            <Flex direction="column">
              <ThirdLevelHeadline>Status</ThirdLevelHeadline>

              <Flex direction="column" gap="tiny">
                <RadioGroup
                  onChange={(value) => {
                    if (status === value) {
                      return
                    }
                    if (value === 'ACTIVE' && taskDistributionPausedUntil) {
                      return confirm('Are you back from vacation?').then(() => {
                        handleUserBackFromVacation()
                        setStatus(value as typeof status)
                      })
                    }
                    setStatus(value as typeof status)
                  }}
                  value={status}
                  options={[
                    { value: 'ACTIVE', label: '🟢 Active' },
                    { value: 'VACATION', label: '🌴 Vacation' },
                  ]}
                />

                {isEditingExtendedLeave ? (
                  <Card>
                    <p>When will you be back?</p>
                    <DateTimePicker
                      date={extendedLeaveForm ?? null}
                      setDate={setExtendedLeaveForm}
                    />
                    <Spacing top="small" />
                    <Flex justify="space-between">
                      <Flex gap="tiny">
                        <Button
                          variant="secondary"
                          disabled={!extendedLeaveForm}
                          onClick={() => {
                            if (extendedLeaveForm) {
                              pauseTaskDistribution(extendedLeaveForm)
                            }
                            setManualEditingExtendedLeave(false)
                          }}
                        >
                          Set vacation date
                        </Button>

                        {!!taskDistributionPausedUntil && (
                          <Button
                            variant="tertiary"
                            onClick={() => setManualEditingExtendedLeave(false)}
                          >
                            Cancel
                          </Button>
                        )}
                      </Flex>
                      {!!taskDistributionPausedUntil && (
                        <Button
                          status="success"
                          onClick={handleUserBackFromVacation}
                        >
                          I'm back
                        </Button>
                      )}
                    </Flex>
                  </Card>
                ) : taskDistributionPausedUntil ? (
                  <Card>
                    <p>
                      Extended Leave <br />
                      <b>
                        {format(taskDistributionPausedUntil, 'dd MMMM yyyy')}
                      </b>
                    </p>

                    <p>
                      No members will be assigned to you during this period.
                    </p>
                    <p>
                      Claims you are exclusively assigned to will be reassigned
                      to checked in users.
                    </p>
                    <Flex justify="space-between">
                      <Popover contents="Change time of leave">
                        <Button
                          onClick={() => setManualEditingExtendedLeave(true)}
                        >
                          Edit
                        </Button>
                      </Popover>
                    </Flex>
                  </Card>
                ) : null}
              </Flex>
            </Flex>
          )}
        </div>
      </div>
      <>
        <Spacing top="large" />
        <div>
          <ThirdLevelHeadline>Markets</ThirdLevelHeadline>
          <Paragraph secondary style={{ fontSize: '1rem' }}>
            These are your focus markets and will be used to customize your
            workflow
          </Paragraph>
          <Flex
            style={{
              flexWrap: 'wrap',
              marginTop: '0.25rem',
              marginBottom: '2.5rem',
              maxWidth: '30rem',
            }}
            justify="space-between"
          >
            {Object.values(Market).map((market) => {
              const checked = markets.includes(market)

              return (
                <Checkbox
                  key={market}
                  style={{ marginTop: '0.25rem' }}
                  label={`${convertEnumOrSentenceToTitle(market)} ${
                    MarketFlags[market]
                  }`}
                  checked={checked}
                  onChange={() =>
                    checked ? removeMarket(market) : addMarket(market)
                  }
                />
              )
            })}
          </Flex>
        </div>
      </>
      {portals.length > 1 && (
        <>
          <Spacing top="large" />
          <div>
            <ThirdLevelHeadline>Portals</ThirdLevelHeadline>
            <Flex fullWidth>
              <AvailablePortals
                portals={portals}
                currentPortal={currentPortal}
              />
            </Flex>
          </div>
        </>
      )}
    </Wrapper>
  )
}

export default ProfilePage
