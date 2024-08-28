import { Flex } from '@hedvig-ui/redesign'
import { InboundForwarding, OutboundForwarding } from '../Forwarding/Forwarding'
import { CheckCircleFill, Circle, Paperclip } from 'react-bootstrap-icons'
import clsx from 'clsx'
import { css } from './Message.css'
import * as datefns from 'date-fns'
import { extractPerformedBy } from '@hope/features/user/util'
import { ChatMessage } from '../../useChatMessages'
import { ChatMessage2Fragment, ChatMessageType } from 'types/generated/graphql'
import Linkify from 'react-linkify'
import { useAtom, useAtomValue } from 'jotai'
import { ConversationState } from '@hope/features/chat/ConversationState'
import { IconButton } from '@hedvig-ui/icons'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { theme } from '@hedvig-ui/redesign/theme'

export function Message({ message }: { message: ChatMessage }) {
  const isForwardingActive = useAtomValue(
    ConversationState.isForwardingActiveAtom,
  )
  const isAdminMessage = message.author.__typename !== 'MemberSystemUser'
  const hasOutboundForwardings = message.outboundForwardings.length > 0

  return (
    <Flex align="center" gap="lg">
      {isForwardingActive && <MessageForwardingCircle message={message} />}

      <Flex
        direction="column"
        fullWidth
        align={isAdminMessage ? 'flex-end' : 'flex-start'}
      >
        {message.inboundForwarding !== undefined && (
          <InboundForwarding forwarding={message.inboundForwarding} />
        )}

        {hasOutboundForwardings && (
          <OutboundForwarding forwardings={message.outboundForwardings} />
        )}

        <div
          className={clsx(css.chatBubble.base, {
            [css.chatBubble.admin]: isAdminMessage,
          })}
        >
          <div className={css.message.wrapper.base}>
            <MessageContent message={message} />
          </div>
        </div>

        {isAdminMessage ? (
          <span className={css.authorLabel}>
            {extractPerformedBy(message.author)}
          </span>
        ) : null}

        <span className={css.timestampLabel}>
          {formatTimestamp(new Date(message.timestamp))}
        </span>
      </Flex>
    </Flex>
  )
}

function MessageForwardingCircle({ message }: { message: ChatMessage }) {
  const [messagesToForward, setMessagesToForward] = useAtom(
    ConversationState.messagesToForwardAtom,
  )

  function addMessageToForward() {
    setMessagesToForward((prev) => [...prev, message])
  }

  function removeMessageToForward() {
    setMessagesToForward((prev) => prev.filter(({ id }) => id !== message.id))
  }

  if (messagesToForward.map(({ id }) => id).includes(message.id)) {
    return (
      <IconButton onClick={removeMessageToForward}>
        <CheckCircleFill
          className={cssUtil.pointer}
          color={theme.colors.signalBlueElement}
          size={20}
        />
      </IconButton>
    )
  }

  return (
    <IconButton onClick={addMessageToForward}>
      <Circle
        className={cssUtil.pointer}
        color={theme.colors.translucent3}
        size={20}
      />
    </IconButton>
  )
}

function MessageContent({ message }: { message: ChatMessage2Fragment }) {
  if (message.type === ChatMessageType.Text) {
    return <TextContent text={message.text!} />
  }

  if (message.type === ChatMessageType.FileUpload) {
    return <FileContent url={message.url!} mimeType={message.mimeType!} />
  }

  return null
}

function TextContent({ text }: { text: string }) {
  return (
    <div>
      <Linkify>{text}</Linkify>
    </div>
  )
}

function FileContent({ url, mimeType }: { url: string; mimeType: string }) {
  const isImage = mimeType.includes('image')

  if (isImage) {
    return (
      <img
        src={url}
        style={{ width: '100%', objectFit: 'cover' }}
        alt="Uploaded image"
      />
    )
  }
  return (
    <a href={url}>
      <Paperclip />
      Attached File
    </a>
  )
}

function formatTimestamp(timestamp: Date): string {
  const date = datefns.isToday(timestamp)
    ? 'today'
    : datefns.isYesterday(timestamp)
      ? 'yesterday'
      : dateFormat.format(timestamp)

  return `${date} at ${timeFormat.format(timestamp)}`
}

const timeFormat = new Intl.DateTimeFormat('en-SE', {
  timeStyle: 'short',
})

const dateFormat = new Intl.DateTimeFormat('en-SE', {
  dateStyle: 'medium',
})
