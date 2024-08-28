import gql from 'graphql-tag'
import { AllTasksDocument, useMoveTaskMutation } from 'types/generated/graphql'
import { convertEmailToName, extractErrorMessage } from '@hedvig-ui'
import { toast } from 'react-hot-toast'

gql`
  mutation MoveTask($taskId: ID!, $userEmail: String!) {
    task_move(taskId: $taskId, userEmail: $userEmail) {
      id
      assignedTo
    }
  }
`

export const useMoveTask = () => {
  const [moveTask, { loading }] = useMoveTaskMutation()

  const move = (taskId: string, email: string) =>
    toast.promise(
      moveTask({
        variables: { taskId, userEmail: email },
        optimisticResponse: {
          task_move: {
            __typename: 'Task',
            id: taskId,
            assignedTo: email,
          },
        },
        refetchQueries: [{ query: AllTasksDocument }],
      }),
      {
        success: `Moved to ${convertEmailToName(email)}`,
        loading: 'Moving',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  return { move, loading }
}
