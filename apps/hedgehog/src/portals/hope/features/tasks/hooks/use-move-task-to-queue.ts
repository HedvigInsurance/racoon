import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import {
  Task,
  TaskResourceArea,
  TaskResourceType,
  useUpdateTaskMetricsMutation,
} from 'types/generated/graphql'
import { extractErrorMessage } from '@hedvig-ui'

gql`
  mutation UpdateTaskMetrics(
    $taskId: ID!
    $area: TaskResourceArea!
    $type: TaskResourceType!
    $note: String
  ) {
    task_updateMetrics(
      taskId: $taskId
      input: { areas: [$area], type: $type, note: $note }
    ) {
      id
      area
      areaAssignment {
        area
        assignedAt
        assignedBy
        note
      }
      resourceType
      typeAssignment {
        type
        assignedAt
        assignedBy
      }
    }
  }
`

export function UseMoveTaskToQueue(
  task: Task,
  options?: { onMoved?: () => void },
) {
  const [updateTaskMetrics] = useUpdateTaskMetricsMutation()

  function moveToQueue(
    area: TaskResourceArea,
    type: TaskResourceType,
    note?: string,
  ) {
    return toast.promise(
      updateTaskMetrics({
        variables: {
          taskId: task.id,
          area: area,
          type: type,
          note: note,
        },
        optimisticResponse: {
          task_updateMetrics: {
            __typename: 'Task',
            id: task.id,
            area: area,
            areaAssignment: {
              __typename: 'TaskResourceAreaAssignment',
              area: area,
              note: note,
            },
            resourceType: type,
            typeAssignment: {
              __typename: 'TaskResourceTypeAssignment',
              type: type,
            },
          },
        },
      }),
      {
        loading: 'Moving to queue...',
        success: () => {
          options?.onMoved?.()
          return 'Moved'
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return { moveToQueue }
}
