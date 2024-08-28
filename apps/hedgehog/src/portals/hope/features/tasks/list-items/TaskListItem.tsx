import { Task } from 'types/generated/graphql'
import { Flex } from '@hedvig-ui/redesign'
import { TaskActionsMenu } from '../components/task-actions-menu/TaskActionsMenu'
import clsx from 'clsx'
import { css } from './TaskListItem.css'
import { UserCirle } from './components/user-circle/UserCircle'
import { TaskResource } from './components/task-resource/TaskResource'
import { TaskTitle } from './components/task-title/TaskTitle'
import { TaskTime } from './components/task-time/TaskTime'

type TaskListItemProps = {
  disabled: boolean
  assignedToMe: boolean
  task: Task
  onClick: () => void
  onClickTitle?: () => void
  selected: boolean
  flag?: React.ReactNode
  customTitle?: string | null
  nextTaskId?: string
  prevTaskId?: string
  autoFocus: boolean
  navigateHandler: (taskId: string) => void
  navigateOnRender: boolean
  track?: boolean | number
  onMove: (taskId: string, email: string) => void
  userTaskCount: Record<string, number>
  onReject: () => void
  onResolve: () => Promise<void>
}

export type TaskListItemExtension = Omit<TaskListItemProps, 'onClick'>

export const TaskListItem = (props: TaskListItemProps) => {
  const {
    task,
    assignedToMe,
    onClick,
    selected,
    onClickTitle,
    flag,
    customTitle,
    onMove,
    userTaskCount,
    onReject,
    onResolve,
  } = props
  const title = customTitle || task.title

  return (
    <div
      key={task.id}
      onClick={onClick}
      className={clsx(css.TaskListItem.base, {
        [css.TaskListItem.selected]: selected,
      })}
    >
      <Flex gap="md" align="center">
        <UserCirle task={task} assignedToMe={assignedToMe} />

        <div className={css.flag}>{flag}</div>

        <TaskTitle
          taskTitle={title}
          onClick={(e) => {
            e.stopPropagation()
            onClickTitle?.()
          }}
        />
      </Flex>

      <p className={css.preview}>{task.description}</p>

      <Flex align="center" gap="xs">
        <TaskResource task={task} />

        <Flex
          align="center"
          justify="flex-end"
          gap="sm"
          style={{
            marginLeft: 'auto',
          }}
        >
          <TaskTime task={task} />

          <TaskActionsMenu
            assignedToMe={assignedToMe}
            task={task}
            onMove={onMove}
            userTaskCount={userTaskCount}
            onReject={onReject}
            onResolve={onResolve}
          />
        </Flex>
      </Flex>
    </div>
  )
}
