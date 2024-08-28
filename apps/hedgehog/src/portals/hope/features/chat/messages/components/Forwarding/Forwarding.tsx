import { Flex, Tooltip } from '@hedvig-ui/redesign'
import { css } from './Forwarding.css'
import { useChat } from '@hope/features/chat/ChatContext'
import { ConversationForwardingFragment } from 'types/generated/graphql'
import { Arrow90degLeft, Arrow90degRight } from 'react-bootstrap-icons'

export function InboundForwarding({
  forwarding,
}: {
  forwarding: ConversationForwardingFragment
}) {
  const { selectConversation } = useChat()
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={css.container}
          onClick={() => selectConversation(forwarding.fromConversationId)}
        >
          <Flex gap="sm" align="center" className={css.text}>
            <Arrow90degLeft />
            <span>Forwarded</span>
          </Flex>
        </div>
      </Tooltip.Trigger>
      {forwarding.note ? (
        <Tooltip.Content>
          <i>"{forwarding.note}"</i>
          <p>Go to conversation</p>
        </Tooltip.Content>
      ) : (
        <Tooltip.Content>Go to conversation</Tooltip.Content>
      )}
    </Tooltip.Root>
  )
}

export function OutboundForwarding({
  forwardings,
}: {
  forwardings: ConversationForwardingFragment[]
}) {
  const { selectConversation } = useChat()
  /* For simplicity, we only show one forwarding per message for now */
  const forwarding = forwardings[0]
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={css.container}
          onClick={() => selectConversation(forwarding.toConversationId)}
        >
          <Flex gap="sm" align="center" className={css.text}>
            <span>Forwarded</span>
            <Arrow90degRight />
          </Flex>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>Go to conversation</Tooltip.Content>
    </Tooltip.Root>
  )
}
