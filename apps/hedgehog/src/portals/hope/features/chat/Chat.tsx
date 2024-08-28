import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from './Chat.css'
import { MessagesList } from './messages/components/MessagesList/MessagesList'
import { ChatInput } from './input/ChatInput'
import { ConversationFragment, Task } from 'types/generated/graphql'
import {
  Button,
  Div,
  DropdownMenu,
  Flex,
  InfoTag,
  Tooltip,
} from '@hedvig-ui/redesign'
import { ChevronLeftIcon, FastForwardIcon, IconButton } from '@hedvig-ui/icons'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { Modal } from '@hedvig-ui'
import { RejectTask } from '../tasks/components/RejectTask'
import { ResolveTask } from '../tasks/components/ResolveTask'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import { ScheduleTaskForm } from '../tasks/components/ScheduleTask'
import { Market } from '../config/constants'
import { MoveToQueue } from '../tasks/components/MoveToQueue'
import { MoveToUser } from '../tasks/components/MoveToUser'
import { MoveToMe } from '../tasks/components/MoveToMe'
import { useAtom, useSetAtom } from 'jotai'
import { ConversationState } from './ConversationState'
import { ForwardConversation } from './components/ForwardConversation/ForwardConversation'
import { ConversationList } from './components/ConversationList/ConversationList'
import { getSubtitleForConversation, getTitleForConversation } from './util'
import {
  ChatProps,
  ChatProvider,
  useChat,
} from 'portals/hope/features/chat/ChatContext'
import { ResolveTaskAndCloseConversation } from '../tasks/components/ResolveTaskAndCloseConversation'
import { CloseConversation } from './messages/components/CloseConversation'

export const Chat = {
  Root: ChatRoot,
  Content: (props: ChatProps) => (
    <ChatProvider props={props}>
      <ChatContent />
    </ChatProvider>
  ),
}

function ChatRoot(props: ComponentProps<'div'>) {
  return <div className={css.Chat} {...props} />
}

function ChatContent() {
  const { activeConversation, createConversation, memberId } = useChat()

  const isProduction = window.location.host.includes('hope.hedvig.com')

  if (activeConversation === undefined) {
    // loading empty state
    return null
  }
  if (activeConversation == null) {
    // conversation list
    return (
      <Flex direction="column" className={css.ChatContent.container}>
        <Flex justify="space-between" className={css.ChatContent.heading}>
          <Flex direction="column" gap="sm">
            <div>Conversations</div>
            <div className={css.ChatContent.memberInfo}>
              <MemberName />
              <span>Member: {memberId}</span>
            </div>
          </Flex>
          {!isProduction && (
            <Button size="small" onClick={createConversation}>
              + New conversation
            </Button>
          )}
        </Flex>
        <ConversationList />
      </Flex>
    )
  }
  return (
    <>
      <ConversationTopBar>
        <Flex style={{ marginLeft: 'auto' }} align="center">
          <ConversationStatus />

          <StandaloneActions />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <span>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <IconButton>
                      <ThreeDotsVertical />
                    </IconButton>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Actions</Tooltip.Content>
                </Tooltip.Root>
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenuActions />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </ConversationTopBar>

      <Conversation
        key={activeConversation.id}
        conversation={activeConversation}
      />
    </>
  )
}

function ConversationStatus() {
  const { activeConversation } = useChat()

  const isProduction = window.location.host.includes('hope.hedvig.com')

  if (isProduction) {
    return null
  }

  if (!activeConversation) {
    return null
  }

  return (
    <Div mr="xxs">
      {activeConversation.closedAt ? (
        <InfoTag variant="neutral">Closed</InfoTag>
      ) : (
        <InfoTag variant="success">Open</InfoTag>
      )}
    </Div>
  )
}

function StandaloneActions() {
  const { activeConversation, activeConversationIsActiveTask, taskProps } =
    useChat()

  const isProduction = window.location.host.includes('hope.hedvig.com')

  if (!activeConversation) {
    return null
  }

  const conversationIsClosed = !!activeConversation.closedAt

  if (taskProps?.task.resolvedAt) {
    return null
  }

  if (activeConversationIsActiveTask && !!taskProps) {
    return (
      <>
        <RejectTask.Standalone
          assignedToMe={taskProps.assignedToMe}
          onReject={taskProps.onReject}
        />

        <ScheduleTask task={taskProps.task} />

        <ResolveTask.Standalone
          assignedToMe={taskProps.assignedToMe}
          onResolve={taskProps.onResolve}
        />

        {!isProduction && !conversationIsClosed && (
          <ResolveTaskAndCloseConversation.Standalone
            assignedToMe={taskProps.assignedToMe}
            onResolve={taskProps.onResolve}
          />
        )}
      </>
    )
  }

  return null
}

function DropdownMenuActions() {
  const setIsForwardingActive = useSetAtom(
    ConversationState.isForwardingActiveAtom,
  )
  const { activeConversation, activeConversationIsActiveTask, taskProps } =
    useChat()

  const isProduction = window.location.host.includes('hope.hedvig.com')

  if (!activeConversation) {
    return null
  }

  const conversationIsClosed = !!activeConversation.closedAt

  if (activeConversationIsActiveTask && !!taskProps) {
    return (
      <>
        <MoveToQueue.MenuItem
          task={taskProps.task}
          onMove={taskProps.navigateToNext}
        />

        {!isProduction && (
          <DropdownMenu.Item
            onClick={() => {
              setIsForwardingActive(true)
            }}
          >
            Forward messages
          </DropdownMenu.Item>
        )}

        <MoveToUser.MenuItem
          onMove={taskProps.onMove}
          task={taskProps.task}
          userTaskCount={taskProps.userTaskCount}
        />

        <MoveToMe.MenuItem
          onMove={taskProps.onMove}
          task={taskProps.task}
          assignedToMe={taskProps.assignedToMe}
        />

        <ResolveTask.MenuItem
          assignedToMe={taskProps.assignedToMe}
          onResolve={taskProps.onResolve}
        />

        {!isProduction && !conversationIsClosed && (
          <ResolveTaskAndCloseConversation.MenuItem
            assignedToMe={taskProps.assignedToMe}
            onResolve={taskProps.onResolve}
          />
        )}

        <RejectTask.MenuItem
          assignedToMe={taskProps.assignedToMe}
          onReject={taskProps.onReject}
        />
      </>
    )
  }

  if (isProduction) {
    return <DropdownMenu.Item>No actions available</DropdownMenu.Item>
  }

  return (
    <>
      <DropdownMenu.Item
        onClick={() => {
          setIsForwardingActive(true)
        }}
      >
        Forward messages
      </DropdownMenu.Item>

      {!conversationIsClosed && (
        <CloseConversation.MenuItem conversationId={activeConversation.id} />
      )}
    </>
  )
}

function Conversation({
  conversation,
  slim,
}: {
  conversation: ConversationFragment
  slim?: boolean
}) {
  const { memberId } = useChat()

  const [isForwardingActive, setIsForwardingActive] = useAtom(
    ConversationState.isForwardingActiveAtom,
  )
  const setMessagesToForward = useSetAtom(
    ConversationState.messagesToForwardAtom,
  )

  useEffect(() => {
    setIsForwardingActive(false)
    setMessagesToForward([])
  }, [conversation.id, setIsForwardingActive, setMessagesToForward])

  if (isForwardingActive) {
    return (
      <>
        <MessagesList conversationId={conversation.id} />
        <Flex
          p="md"
          justify="flex-end"
          align="flex-end"
          gap="sm"
          style={{ height: '250px' }}
        >
          <Button
            size="large"
            variant="ghost"
            onClick={() => setIsForwardingActive(false)}
          >
            Cancel
          </Button>
          <ForwardConversation />
        </Flex>
      </>
    )
  }
  return (
    <>
      <MessagesList conversationId={conversation.id} />
      <ChatInput
        memberId={memberId}
        conversationId={conversation.id}
        slim={slim}
      />
    </>
  )
}

function ScheduleTask({ task }: { task: Task }) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  if (!task.memberId || !task.market || !task.title) {
    return null
  }

  return (
    <>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton onClick={() => setShowModal(true)}>
            <FastForwardIcon />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Schedule</Tooltip.Content>
      </Tooltip.Root>

      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <ScheduleTaskForm
          memberId={task.memberId}
          resourceId={task.resourceId}
          market={task.market as Market}
          title={task.title}
          area={task.area ?? null}
          resourceType={task.resourceType}
          currentTaskId={task.id}
          onSubmit={() => setShowModal(false)}
          onResolve={() => navigate(`/inbox`, { replace: true })}
          conversationId={task.conversationId ?? null}
          claimId={task.claimId ?? null}
        />
      </Modal>
    </>
  )
}

function ConversationTopBar({ children }: { children: ReactNode }) {
  const { activeConversation, clearConversationSelection } = useChat()

  if (!activeConversation) {
    return null
  }

  const title = getTitleForConversation(activeConversation)
  const subtitle = getSubtitleForConversation(activeConversation)

  return (
    <div className={css.ConversationTopBar}>
      <Flex gap="sm" align="center" fullWidth>
        <IconButton onClick={clearConversationSelection}>
          <ChevronLeftIcon />
        </IconButton>

        <Flex direction="column">
          <Flex gap="sm" align="center">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <MemberName />
              </Tooltip.Trigger>
              <Tooltip.Content>Go to member</Tooltip.Content>
            </Tooltip.Root>
          </Flex>
          <Flex gap="xxs">
            <p>{title}</p>
            {subtitle && (
              <>
                <span>•</span>
                <p className={cssUtil.textMuted}>{subtitle}</p>
              </>
            )}
          </Flex>
        </Flex>

        {children}
      </Flex>
    </div>
  )
}

function MemberName() {
  const { memberData, onSelectMember } = useChat()
  if (!memberData) {
    return null
  }
  return (
    <p className={cssUtil.textLink} onClick={onSelectMember}>
      {memberData.firstName} {memberData.lastName}
    </p>
  )
}
