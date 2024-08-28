import { IconButton } from '@hedvig-ui/icons'
import { DropdownMenu, Tooltip } from '@hedvig-ui/redesign'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import { Task } from 'types/generated/graphql'
import { ResolveTask } from '../ResolveTask'
import { RejectTask } from '../RejectTask'
import { MoveToUser } from '../MoveToUser'
import { MoveToMe } from '../MoveToMe'
import { MoveToQueue } from '../MoveToQueue'

export function TaskActionsMenu(props: {
  assignedToMe: boolean
  task: Task
  onMove: (taskId: string, email: string) => void
  userTaskCount: Record<string, number>
  onReject: () => void
  onResolve: () => Promise<void>
  navigateToNext?: () => void
}) {
  const {
    task,
    assignedToMe,
    onMove,
    userTaskCount,
    onReject,
    onResolve,
    navigateToNext,
  } = props

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton>
                <ThreeDotsVertical />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content>Actions</Tooltip.Content>
          </Tooltip.Root>
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <MoveToQueue.MenuItem task={task} onMove={navigateToNext} />

        <MoveToUser.MenuItem
          onMove={onMove}
          task={task}
          userTaskCount={userTaskCount}
        />

        <MoveToMe.MenuItem
          onMove={onMove}
          task={task}
          assignedToMe={assignedToMe}
        />

        <ResolveTask.MenuItem
          assignedToMe={assignedToMe}
          onResolve={onResolve}
        />

        <RejectTask.MenuItem assignedToMe={assignedToMe} onReject={onReject} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
