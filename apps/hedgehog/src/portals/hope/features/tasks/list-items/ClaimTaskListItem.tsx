import * as React from 'react'
import {
  TaskListItem,
  TaskListItemExtension,
} from '@hope/features/tasks/list-items/TaskListItem'
import { getMemberFlag } from '@hope/features/member/utils'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'

export const ClaimTaskListItem: React.FC<TaskListItemExtension> = ({
  task,
  ...props
}) => {
  const { taskNavigate } = useTaskNavigation()
  const claimId = task.claimId

  const market = task?.market

  const flag = market ? getMemberFlag({ market }) : '🏳'

  return (
    <TaskListItem
      {...props}
      task={task}
      flag={flag}
      onClick={() => {
        if (claimId) {
          return taskNavigate({
            taskId: task.id,
            tab: 'claims',
            claimIds: claimId,
            memberId: task.memberId,
            active: claimId,
          })
        }
        return taskNavigate({ taskId: task.id })
      }}
      onClickTitle={() => {
        if (claimId) {
          return taskNavigate({
            taskId: task.id,
            tab: 'claims',
            claimIds: claimId,
            memberId: task.memberId,
            active: claimId,
          })
        }
        taskNavigate({
          taskId: task.id,
          memberId: task.memberId,
          active: task.memberId,
        })
      }}
    />
  )
}
