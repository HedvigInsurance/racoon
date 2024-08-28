import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import {
  ConversationFragment,
  MemberChatInfoFragment,
  MemberConversationsDocument,
  Task,
  useCreateConversationMutation,
  useMemberChatInfoQuery,
  useMemberConversationsQuery,
} from 'types/generated/graphql'
import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export type ChatProps = {
  memberId: string
  defaultConversation?: string
  claimId?: string
  taskProps?: {
    assignedToMe: boolean
    task: Task
    onResolve: () => Promise<void>
    onReject: () => void
    onMove: (taskId: string, email: string) => void
    navigateToNext: () => void
    onSelectMember: (memberId: string) => void
    userTaskCount: Record<string, number>
  }
}

type ChatContextState = ChatProps & {
  conversations: ConversationFragment[]
  activeConversation: ConversationFragment | null | undefined
  selectConversation: (id: string) => void
  clearConversationSelection: () => void
  createConversation: () => Promise<void>

  memberData?: MemberChatInfoFragment
  onSelectMember: () => void
  activeConversationIsActiveTask: boolean
  activeTaskConversationId?: string
  activeClaimConversationId?: string
}

const ChatContext = createContext<ChatContextState | null>(null)

export function useChat() {
  const state = useContext(ChatContext)

  if (!state) {
    throw Error('useChat must be used inside ChatProvider')
  }

  return state
}

export function ChatProvider({
  props,
  children,
}: {
  props: ChatProps
  children: ReactNode
}) {
  const chatData = useChatConversations(
    props.memberId,
    props.defaultConversation,
  )
  const { data: memberChatData } = useMemberChatInfoQuery({
    variables: { memberId: props.memberId },
  })
  const navigate = useNavigate()

  const memberData = memberChatData?.member ?? undefined
  const activeConversationIsActiveTask =
    !!chatData.activeConversation &&
    !!props.taskProps &&
    (chatData.activeConversation.id === props.taskProps?.task.conversationId ||
      (chatData.activeConversation.claimId &&
        chatData.activeConversation.claimId ===
          props.taskProps?.task.claimId) ||
      chatData.conversations.length === 1)

  const activeTaskConversationId =
    props.taskProps?.task?.conversationId ?? undefined

  const activeClaimConversationId =
    props.claimId !== undefined
      ? chatData.conversations.find((c) => c.claimId === props.claimId)?.id
      : undefined

  function onSelectMember() {
    if (props.taskProps?.onSelectMember) {
      props.taskProps.onSelectMember(props.memberId)
    } else {
      navigate(`/members/${props.memberId}`)
    }
  }

  const contextProps = {
    ...props,
    ...chatData,
    memberData,
    onSelectMember,
    activeConversationIsActiveTask,
    activeTaskConversationId,
    activeClaimConversationId,
  }

  return (
    <ChatContext.Provider value={contextProps}>{children}</ChatContext.Provider>
  )
}

const useChatConversations = (
  memberId: string,
  defaultConversation?: string,
) => {
  const { data, refetch } = useMemberConversationsQuery({
    variables: { memberId },
  })

  const [createConversationMutation] = useCreateConversationMutation({
    variables: { input: { memberId } },
  })

  const [activeConversationId, setActiveConversationId] = useState<
    | string // we are looking at a conversation
    | null // we have explicitly left a conversation to view the list
    | undefined // we have not made any choice, auto-pick conversation if only 1
  >(defaultConversation)

  const activeConversation:
    | ConversationFragment // viewing conversation
    | null // viewing list
    | undefined = // loading data
    useMemo(() => {
      if (!data?.member?.conversations) {
        // we are still loading data, show no active conversation
        return undefined
      } else if (activeConversationId === null) {
        // we explicitly de-selected an active conversation, which means
        // we should show nothing
        return null
      } else if (activeConversationId === undefined) {
        // no conversation has been chosen, but if there is only ONE
        // we select that by default
        return data?.member?.conversations?.length === 1
          ? data?.member?.conversations[0]
          : null
      } else {
        return data?.member?.conversations?.find(
          ({ id }) => id === activeConversationId,
        )
      }
    }, [data?.member?.conversations, activeConversationId])

  function selectConversation(id: string) {
    setActiveConversationId(id)
  }

  function clearConversationSelection() {
    setActiveConversationId(null)
    // This means we go back to the conversation list, so we do a refetch of them
    refetch()
  }

  const { confirm } = useConfirmDialog()
  async function createConversation() {
    try {
      await confirm(
        `Do you want to create a conversation for member ${memberId}?`,
      )
      await toast.promise(
        createConversationMutation({
          refetchQueries: [
            { query: MemberConversationsDocument, variables: { memberId } },
          ],
        }),
        {
          loading: 'Creating',
          success: 'Conversation created',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    } catch (e) {
      // confirm cancelled
    }
  }

  return {
    conversations: data?.member?.conversations ?? [],
    activeConversation,
    selectConversation,
    clearConversationSelection,
    createConversation,
  }
}
