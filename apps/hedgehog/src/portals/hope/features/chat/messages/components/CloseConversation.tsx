import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'
import { IconButton, XCircleIcon } from '@hedvig-ui/icons'
import { DropdownMenu, Tooltip } from '@hedvig-ui/redesign'
import gql from 'graphql-tag'
import { useCloseConversationMutation } from 'types/generated/graphql'
import toast from 'react-hot-toast'

gql`
  mutation CloseConversation($input: ConversationCloseInput!) {
    conversation_close(input: $input) {
      ...Conversation
    }
  }
`

function useCloseConversation(conversationId: string) {
  const [closeConversationMutation] = useCloseConversationMutation()
  const { confirm } = useConfirmDialog()

  async function submit() {
    try {
      await confirm('This will close the conversation')
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

function Standalone({ conversationId }: { conversationId: string }) {
  const close = useCloseConversation(conversationId)

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton
          onClick={async (e) => {
            e.stopPropagation()
            close()
          }}
        >
          <XCircleIcon />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Close conversation</Tooltip.Content>
    </Tooltip.Root>
  )
}

function MenuItem({ conversationId }: { conversationId: string }) {
  const close = useCloseConversation(conversationId)
  return (
    <DropdownMenu.Item
      onClick={async (e) => {
        e.stopPropagation()
        close()
      }}
    >
      Close conversation
    </DropdownMenu.Item>
  )
}

export const CloseConversation = {
  Standalone,
  MenuItem,
}
