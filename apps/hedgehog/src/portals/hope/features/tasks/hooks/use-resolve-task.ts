import gql from 'graphql-tag'
import {
  AllTasksDocument,
  AllTasksQuery,
  useResolveTaskMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { extractErrorMessage } from '@hedvig-ui'
import { toast } from 'react-hot-toast'

gql`
  mutation ResolveTask($taskId: ID!) {
    resolveTask(taskId: $taskId) {
      id
      assignedTo
    }
  }
`

export const useResolveTask = () => {
  const [resolveTask, { loading }] = useResolveTaskMutation()
  const resolve = (taskId: string) =>
    toast.promise(
      resolveTask({
        variables: { taskId },
        optimisticResponse: {
          resolveTask: {
            __typename: 'Task',
            id: taskId,
            assignedTo: null,
          },
        },
        update: (cache: ApolloCache<NormalizedCacheObject>) => {
          const cachedData = cache.readQuery({
            query: AllTasksDocument,
          })

          const cachedTasks = (cachedData as AllTasksQuery)?.tasks

          if (!cachedTasks) {
            return
          }

          cache.writeQuery({
            query: AllTasksDocument,
            data: {
              tasks: cachedTasks.filter((task) => task.id !== taskId),
            },
          })
        },
      }),
      {
        success: 'Resolved',
        loading: 'Resolving',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  return { resolve, loading }
}
