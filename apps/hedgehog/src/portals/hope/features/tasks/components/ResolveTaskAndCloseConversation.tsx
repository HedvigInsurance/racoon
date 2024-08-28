import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'
import { CheckCircleXIcon, IconButton } from '@hedvig-ui/icons'
import { DropdownMenu, Tooltip } from '@hedvig-ui/redesign'
import { useCloseConversationMutation } from 'types/generated/graphql'
import toast from 'react-hot-toast'
import { useChat } from '@hope/features/chat/ChatContext'

type Props = {
  assignedToMe: boolean
  onResolve: () => Promise<void>
}

function useResolveTaskAndCloseConversation(props: Props) {
  const [closeConversationMutation] = useCloseConversationMutation()
  const { confirm } = useConfirmDialog()
  const { activeConversation } = useChat()
  const conversationId = activeConversation?.id

  if (!conversationId) {
    return undefined
  }

  async function submit() {
    if (!conversationId) {
      throw new Error('No active conversation')
    }
    try {
      await confirm('This will resolve the task and close the conversation')
      if (!props.assignedToMe) {
        await confirm('Resolve this task? It is not assigned to you', 'danger')
      }
      await props.onResolve()
      toast.promise(
        closeConversationMutation({ variables: { input: { conversationId } } }),
        {
          loading: 'Closing',
          success: 'Closed',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    } catch (reason) {
      console.error(reason)
    }
  }

  return submit
}

function Standalone(props: Props) {
  const resolveAndClose = useResolveTaskAndCloseConversation(props)
  if (!resolveAndClose) {
    return null
  }
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton
          onClick={async (e) => {
            e.stopPropagation()
            resolveAndClose()
          }}
        >
          <CheckCircleXIcon />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Resolve and close</Tooltip.Content>
    </Tooltip.Root>
  )
}

function MenuItem(props: Props) {
  const resolveAndClose = useResolveTaskAndCloseConversation(props)
  if (!resolveAndClose) {
    return null
  }
  return (
    <DropdownMenu.Item
      onClick={async (e) => {
        e.stopPropagation()
        resolveAndClose()
      }}
    >
      Resolve and close
    </DropdownMenu.Item>
  )
}

export const ResolveTaskAndCloseConversation = {
  Standalone,
  MenuItem,
}
