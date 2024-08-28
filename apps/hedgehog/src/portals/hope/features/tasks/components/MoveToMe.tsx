import { DropdownMenu } from '@hedvig-ui/redesign'
import { useMe } from '@hope/features/user/hooks/use-me'
import { Task } from 'types/generated/graphql'

type Props = {
  onMove: (taskId: string, userEmail: string) => void
  task: Task
  assignedToMe: boolean
}

function MenuItem(props: Props) {
  const { me } = useMe()

  if (!me.checkedIn || props.task.assignedTo === me.email) return null

  if (props.assignedToMe) {
    return null
  }

  return (
    <DropdownMenu.Item
      onClick={(e) => {
        e.stopPropagation()
        props.onMove(props.task.id, me.email)
      }}
    >
      Move to me
    </DropdownMenu.Item>
  )
}

export const MoveToMe = {
  MenuItem,
}
