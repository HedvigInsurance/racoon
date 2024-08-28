import { IconButton } from '@hedvig-ui/icons'
import { DropdownMenu, Tooltip } from '@hedvig-ui/redesign'
import { XCircle } from 'react-bootstrap-icons'

type Props = {
  assignedToMe: boolean
  onReject: () => void
}

function Standalone(props: Props) {
  if (!props.assignedToMe) {
    return null
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            props.onReject()
          }}
        >
          <XCircle size={20} />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Reject</Tooltip.Content>
    </Tooltip.Root>
  )
}

function MenuItem(props: Props) {
  if (!props.assignedToMe) {
    return null
  }

  return (
    <DropdownMenu.Item
      onClick={(e) => {
        e.stopPropagation()
        props.onReject()
      }}
    >
      Reject
    </DropdownMenu.Item>
  )
}

export const RejectTask = {
  Standalone,
  MenuItem,
}
