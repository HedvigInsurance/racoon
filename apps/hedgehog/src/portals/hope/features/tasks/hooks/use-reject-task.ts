import gql from 'graphql-tag'
import {
  AllTasksDocument,
  useRejectTaskMutation,
} from 'types/generated/graphql'
import { extractErrorMessage } from '@hedvig-ui'
import toast from 'react-hot-toast'

gql`
  mutation RejectTask($taskId: ID!) {
    task_reject(taskId: $taskId) {
      id
      assignedTo
    }
  }
`

export const useRejectTask = () => {
  const [rejectTask, { loading }] = useRejectTaskMutation()

  const reject = (taskId: string) =>
    toast.promise(
      rejectTask({
        variables: { taskId },
        optimisticResponse: {
          task_reject: {
            __typename: 'Task',
            id: taskId,
            assignedTo: null,
          },
        },
        refetchQueries: [{ query: AllTasksDocument }],
      }),
      {
        success: 'Rejected',
        loading: 'Rejecting',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  return { reject, loading }
}
