import { useConfirmDialog } from '@hedvig-ui'
import { CheckCircleIcon, IconButton } from '@hedvig-ui/icons'
import { DropdownMenu, Tooltip } from '@hedvig-ui/redesign'

type Props = {
  assignedToMe: boolean
  onResolve: () => Promise<void>
}

function Standalone(props: Props) {
  const { confirm } = useConfirmDialog()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton
          onClick={async (e) => {
            e.stopPropagation()
            if (!props.assignedToMe) {
              await confirm(
                'Resolve this task? It is not assigned to you',
                'danger',
              )
            }
            props.onResolve()
          }}
        >
          <CheckCircleIcon />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Resolve</Tooltip.Content>
    </Tooltip.Root>
  )
}

function MenuItem(props: Props) {
  const { confirm } = useConfirmDialog()
  return (
    <DropdownMenu.Item
      onClick={async (e) => {
        e.stopPropagation()
        if (!props.assignedToMe) {
          await confirm(
            'Resolve this task? It is not assigned to you',
            'danger',
          )
        }
        props.onResolve()
      }}
    >
      Resolve
    </DropdownMenu.Item>
  )
}

export const ResolveTask = {
  Standalone,
  MenuItem,
}
