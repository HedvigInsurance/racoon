import { useEffect, useRef } from 'react'
import { Flex } from '@hedvig-ui/redesign'
import { css } from './MessagesList.css'
import { Spinner } from '@hedvig-ui'
import { useChatMessages } from '@hope/features/chat/messages/useChatMessages'

import { Message } from '../Message/Message'

export function MessagesList({ conversationId }: { conversationId: string }) {
  const { messages, fetchOlder, hasMore } = useChatMessages(conversationId)

  return (
    <div className={css.MessagesList}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {hasMore && <LoadMoreIndicator onTriggered={fetchOlder} />}
    </div>
  )
}

function LoadMoreIndicator({ onTriggered }: { onTriggered: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onTriggered()
      }
    })
    const element = ref.current
    if (element) {
      observer.observe(element)
    }
    return () => {
      element && observer.unobserve(element)
    }
  }, [ref, onTriggered])
  return (
    <Flex ref={ref} justify="center" align="center" p="large" gap="medium">
      <Spinner style={{ margin: 0 }} />
      Loading more...
    </Flex>
  )
}
