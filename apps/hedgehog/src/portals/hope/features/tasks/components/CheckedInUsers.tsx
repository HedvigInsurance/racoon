import { TaskMode } from '@hope/features/tasks/hooks/use-tasks'
import { useUsers } from '@hope/features/user/hooks/use-users'
import UserTaskInfo from '@hope/features/tasks/components/UserTaskInfo'
import { DetailedHTMLProps, DetailsHTMLAttributes, useState } from 'react'
import {
  Button,
  LegacyTooltip,
  PopupMenu,
  PopupMenuItem,
} from '@hedvig-ui/redesign'
import { PeopleFill } from 'react-bootstrap-icons'

const CheckedInUsers: React.FC<
  {
    assignedTo: string
    setAssignedTo: (assignedTo: string) => void
    setMode: React.Dispatch<React.SetStateAction<TaskMode>>
    userTaskCount: Record<string, number>
  } & DetailedHTMLProps<DetailsHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ assignedTo, setAssignedTo, setMode, userTaskCount }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { checkedInUsers } = useUsers()

  if (checkedInUsers.length === 0) {
    return (
      <LegacyTooltip content="Checked in users">
        <Button onClick={() => setShowMenu(true)}>
          <PeopleFill />0
        </Button>
      </LegacyTooltip>
    )
  }

  return (
    <PopupMenu
      visible={showMenu}
      onClose={() => setShowMenu(false)}
      target={
        <LegacyTooltip content="Checked in users">
          <Button variant="secondary" onClick={() => setShowMenu(true)}>
            <PeopleFill />
            {checkedInUsers.length}
          </Button>
        </LegacyTooltip>
      }
    >
      {checkedInUsers.map((user) => (
        <PopupMenuItem key={user.id}>
          <UserTaskInfo
            key={user.id}
            onClick={(e) => {
              e.stopPropagation()
              setAssignedTo(user.email)
              setMode(TaskMode.User)
            }}
            user={user}
            userTaskCount={userTaskCount}
            selected={assignedTo === user.email}
          />
        </PopupMenuItem>
      ))}
    </PopupMenu>
  )
}

export default CheckedInUsers
