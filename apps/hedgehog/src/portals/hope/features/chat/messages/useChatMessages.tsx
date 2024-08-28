import {
  ChatMessage2Fragment,
  ConversationForwardingFragment,
  ConversationFragment,
  useConversationQuery,
  useMessagePageLazyQuery,
} from 'types/generated/graphql'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChatEventBus } from '@hope/features/chat/ChatEventBus'

/**
 * We stitch together types from two query paths and put them together here.
 *
 * It was the pragmatic choice to do it in the client rather than backend.
 */
export type ChatMessage = ChatMessage2Fragment & {
  inboundForwarding?: ConversationForwardingFragment
  outboundForwardings: ConversationForwardingFragment[]
}

export function useChatMessages(conversationId: string) {
  const { polledMessages, fetchOlder, hasMore } =
    usePaginatedChatMessages(conversationId)
  const { data: { conversation } = {} } = useConversationQuery({
    variables: { id: conversationId },
  })

  const messages = useMemo(() => {
    if (!conversation) return []
    return stitchMessagesWithForwardings(polledMessages, conversation)
  }, [conversation, polledMessages])

  // debug helper to verify we don't reuse this hook for multiple conversations
  const currentConversationId = useRef(conversationId)
  useEffect(() => {
    if (conversationId != currentConversationId.current) {
      console.error(
        'conversationId changed in hook that expected complete key-based re-render',
      )
    }
  }, [conversationId])

  return {
    messages,
    fetchOlder,
    hasMore,
  }
}

type InternalState = {
  isFetchingOlder: boolean
  isFetchingNewer: boolean
  newerToken?: string
  olderToken?: string
}

function usePaginatedChatMessages(conversationId: string) {
  const [getMessagePage] = useMessagePageLazyQuery({
    fetchPolicy: 'network-only',
  })
  const [polledMessages, setPolledMessages] = useState<ChatMessage2Fragment[]>(
    [],
  )
  const stateRef = useRef<InternalState>({
    isFetchingOlder: false,
    isFetchingNewer: false,
  })

  const fetchOlder = useCallback(async () => {
    if (stateRef.current.isFetchingOlder) return // don't collide with other fetch

    stateRef.current.isFetchingOlder = true
    try {
      const queryResult = await getMessagePage({
        variables: {
          conversationId,
          olderToken: stateRef.current.olderToken,
        },
      })

      const page = queryResult.data?.conversationMessagePage
      if (page) {
        setPolledMessages((prev) => [...prev, ...page.messages])
        stateRef.current.olderToken = page.olderToken ?? undefined
      }
    } finally {
      stateRef.current.isFetchingOlder = false
    }
  }, [getMessagePage, conversationId])

  const fetchNewer = useCallback(async () => {
    if (stateRef.current.isFetchingNewer) return // don't collide with other fetch

    stateRef.current.isFetchingNewer = true
    try {
      const queryResult = await getMessagePage({
        variables: {
          conversationId,
          newerToken: stateRef.current.newerToken,
        },
      })

      const page = queryResult.data?.conversationMessagePage
      if (page) {
        setPolledMessages((prev) => [...page.messages, ...prev])

        if (page.newerToken) {
          stateRef.current.newerToken = page.newerToken
        }

        if (page.olderToken) {
          // initial fetch provides olderToken
          stateRef.current.olderToken = page.olderToken
        }
      }
    } finally {
      stateRef.current.isFetchingNewer = false
    }
  }, [getMessagePage, conversationId])

  // listen to new messages sent
  useEffect(() => {
    return ChatEventBus.onMessageSent(conversationId, fetchNewer)
  }, [conversationId, fetchNewer])

  // set up polling for newer messages
  const pollingTimeout = useRef<NodeJS.Timeout>()
  const pollNewer = useCallback(async () => {
    try {
      await fetchNewer()
    } finally {
      pollingTimeout.current = setTimeout(pollNewer, 5000)
    }
  }, [fetchNewer])
  useEffect(() => {
    pollNewer().catch(console.error)
    return () => clearTimeout(pollingTimeout.current)
  }, [pollNewer])

  return {
    polledMessages,
    fetchOlder,
    hasMore: !!stateRef.current.olderToken,
  }
}

function stitchMessagesWithForwardings(
  messages: ChatMessage2Fragment[],
  conversation: ConversationFragment,
): ChatMessage[] {
  // chat messages can only have been created by one forwarding
  const inboundForwardingsByMessageId = new Map<
    string,
    ConversationForwardingFragment
  >()
  conversation.inboundForwardings.forEach((inbound) => {
    inbound.entries.forEach((entry) => {
      inboundForwardingsByMessageId.set(entry.toMessageId, inbound)
    })
  })

  // but they can have been forwarded multiple times
  const outboundForwardingsByMessageId = new Map<
    string,
    ConversationForwardingFragment[]
  >()
  conversation.outboundForwardings.forEach((outbound) => {
    outbound.entries.forEach((entry) => {
      const list = outboundForwardingsByMessageId.get(entry.fromMessageId) ?? []
      list.push(outbound)
      outboundForwardingsByMessageId.set(entry.fromMessageId, list)
    })
  })
  return messages.map((message) => ({
    ...message,
    inboundForwarding: inboundForwardingsByMessageId.get(message.id),
    outboundForwardings: outboundForwardingsByMessageId.get(message.id) ?? [],
  }))
}
