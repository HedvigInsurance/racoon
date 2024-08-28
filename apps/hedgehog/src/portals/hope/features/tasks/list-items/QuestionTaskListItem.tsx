import * as React from 'react'
import {
  TaskListItem,
  TaskListItemExtension,
} from '@hope/features/tasks/list-items/TaskListItem'
import { getMemberFlag } from '@hope/features/member/utils'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'

export const QuestionTaskListItem: React.FC<TaskListItemExtension> = ({
  task,
  ...props
}) => {
  const { taskNavigate } = useTaskNavigation()
  const memberId = task.memberId

  const market = task?.market

  const flag = market ? getMemberFlag({ market }) : '🏳'

  return (
    <TaskListItem
      {...props}
      task={task}
      flag={flag}
      onClick={() => taskNavigate({ taskId: task.id })}
      onClickTitle={() => {
        if (task.claimId) {
          taskNavigate({
            memberId,
            tab: 'claims',
            claimIds: task.claimId,
            active: task.claimId,
            taskId: task.id,
          })
        } else {
          taskNavigate({
            memberId: memberId,
            taskId: task.id,
            active: memberId,
          })
        }
      }}
    />
  )
}
