import gql from 'graphql-tag'
import {
  TaskResourceArea,
  TaskResourceType,
  useCreateTaskMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { Market } from '@hope/features/config/constants'
import { nextMonday, setHours, startOfDay, startOfTomorrow } from 'date-fns'
import { formatDistanceTo } from '@hedvig-ui/utils/date'

gql`
  mutation CreateTask($input: TaskCreateInput!) {
    task_create(input: $input) {
      ...Task
    }
  }
`
export const useCreateTask = () => {
  const [createTask] = useCreateTaskMutation()

  const createScheduledTask = (
    memberId: string,
    resourceId: string,
    market: Market,
    title: string,
    area: TaskResourceArea | null,
    type: TaskResourceType,
    assignableFromDay: ('TOMORROW' | 'MONDAY') | Date,
    assignableTo: string | null,
    note: string,
    conversationId: string | null,
    claimId: string | null,
  ) => {
    const assignableFrom = (
      assignableFromDay === 'TOMORROW'
        ? setHours(startOfTomorrow(), 8)
        : assignableFromDay === 'MONDAY'
          ? setHours(startOfDay(nextMonday(new Date())), 8)
          : assignableFromDay
    ).toISOString()
    return toast.promise(
      createTask({
        variables: {
          input: {
            memberId,
            resourceId,
            type,
            market,
            title,
            description: note,
            assignableFrom,
            assignableTo,
            note,
            area,
            conversationId,
            claimId,
          },
        },
      }),
      {
        success: `Task scheduled, assignable ${formatDistanceTo(
          assignableFrom,
          {
            addSuffix: true,
          },
        )}`,
        loading: 'Scheduling task...',
        error: 'Something went wrong',
      },
    )
  }
  return {
    createScheduledTask,
  }
}
