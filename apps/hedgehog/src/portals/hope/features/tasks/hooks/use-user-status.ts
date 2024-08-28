import gql from 'graphql-tag'
import { useMe } from '@hope/features/user/hooks/use-me'
import {
  AllTasksDocument,
  CheckInMutation,
  CheckOutMutation,
  PauseUserCheckoutMutation,
  PauseUserTaskDistributionMutation,
  useCheckInMutation,
  useCheckOutMutation,
  usePauseUserCheckoutMutation,
  usePauseUserTaskDistributionMutation,
  UsersDocument,
} from 'types/generated/graphql'
import { FetchResult } from '@apollo/client'
import { convertEmailToName, extractErrorMessage } from '@hedvig-ui'
import { toast } from 'react-hot-toast'

gql`
  mutation CheckIn {
    userCheckIn {
      id
      checkedIn
      distributionPausedMinutes
      distributionPausedUntil
      checkoutPausedMinutes
      tasks {
        id
        assignedTo
      }
    }
  }

  mutation CheckOut($email: String) {
    user_checkOut(email: $email) {
      id
      checkedIn
      distributionPausedUntil
    }
  }

  mutation PauseUserTaskDistribution($until: Instant!) {
    user_pauseDistribution(until: $until) {
      id
      distributionPausedMinutes
      distributionPausedUntil
    }
  }

  mutation PauseUserCheckout {
    user_pauseCheckout {
      id
      checkoutPausedMinutes
    }
  }

  query CheckInInformation {
    me {
      email
      user {
        id
        email
        checkedIn
      }
    }
  }
`

interface UseUserModeResult {
  checkedIn: boolean
  checkIn: () => Promise<FetchResult<CheckInMutation>>
  checkOut: (email?: string) => Promise<FetchResult<CheckOutMutation>>
  pauseTaskDistribution: (
    until: Date,
  ) => Promise<FetchResult<PauseUserTaskDistributionMutation>>
  taskDistributionPausedUntil: Date | null
  taskDistributionPausedMinutes: number | null
  pauseUserCheckout: () => Promise<FetchResult<PauseUserCheckoutMutation>>
  userCheckoutPausedMinutes: number | null
}

export const useUserStatus = (): UseUserModeResult => {
  const { me } = useMe()
  const [checkIn] = useCheckInMutation()
  const [checkOut] = useCheckOutMutation()
  const [pauseTaskDistribution] = usePauseUserTaskDistributionMutation()
  const [pauseUserCheckout] = usePauseUserCheckoutMutation()

  const checkInHandler = async () =>
    toast.promise(
      checkIn({
        optimisticResponse: {
          userCheckIn: {
            id: me.userId,
            checkedIn: true,
            distributionPausedMinutes: null,
            distributionPausedUntil: null,
            checkoutPausedMinutes: null,
            tasks: [],
          },
        },
        refetchQueries: [{ query: AllTasksDocument }, { query: UsersDocument }],
      }),
      {
        loading: 'Checking in...',
        success: 'Checked in',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  const checkOutHandler = async (email?: string) =>
    toast.promise(
      checkOut({
        variables: {
          email: email ?? null,
        },
        optimisticResponse: {
          user_checkOut: {
            id: me.userId,
            checkedIn: false,
            distributionPausedUntil: null,
          },
        },
        refetchQueries: [{ query: AllTasksDocument }, { query: UsersDocument }],
      }),
      {
        loading: 'Checking out...',
        success: () =>
          `${email ? convertEmailToName(email) : 'You are'} checked out`,
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  const pauseTaskDistributionHandler = async (until: Date) =>
    toast.promise(
      pauseTaskDistribution({
        variables: { until },
        optimisticResponse: {
          user_pauseDistribution: {
            id: me.userId,
            distributionPausedMinutes:
              (until.getTime() - Date.now()) / (1000 * 60),
            distributionPausedUntil: until ? until.toISOString() : null,
          },
        },
      }),
      {
        loading: 'Stopping member assignment...',
        success: `Member assignment stop${
          me.taskDistributionPausedMinutes ? ' refreshed' : 'ped'
        }`,
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  return {
    checkIn: checkInHandler,
    checkOut: checkOutHandler,
    pauseTaskDistribution: pauseTaskDistributionHandler,
    taskDistributionPausedUntil: me.taskDistributionPausedUntil,
    taskDistributionPausedMinutes: me.taskDistributionPausedMinutes,
    pauseUserCheckout: pauseUserCheckout,
    userCheckoutPausedMinutes: me.userCheckoutPausedMinutes,
    checkedIn: me.checkedIn,
  }
}
