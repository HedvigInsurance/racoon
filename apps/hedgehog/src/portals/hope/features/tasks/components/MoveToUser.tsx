import UserTaskInfo from '@hope/features/tasks/components/UserTaskInfo'
import { useUsers } from '@hope/features/user/hooks/use-users'
import { Task } from 'types/generated/graphql'
import { DropdownMenu, DropdownSubMenu } from '@hedvig-ui/redesign'

type Props = {
  onMove: (taskId: string, userEmail: string) => void
  task: Task
  userTaskCount: Record<string, number>
}

function MenuItem(props: Props) {
  const { checkedInUsers } = useUsers()

  if (checkedInUsers.length === 0) return null

  return (
    <DropdownSubMenu.Root>
      <DropdownSubMenu.Trigger>Move to user</DropdownSubMenu.Trigger>
      <DropdownSubMenu.Content>
        {checkedInUsers.map((user) => (
          <DropdownMenu.Item key={user.id}>
            <UserTaskInfo
              key={user.id}
              onClick={(e) => {
                e.stopPropagation()
                props.onMove(props.task.id, user.email)
              }}
              selected={user.email === props.task.assignedTo}
              user={user}
              userTaskCount={props.userTaskCount}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownSubMenu.Content>
    </DropdownSubMenu.Root>
  )
}

export const MoveToUser = {
  MenuItem,
}
