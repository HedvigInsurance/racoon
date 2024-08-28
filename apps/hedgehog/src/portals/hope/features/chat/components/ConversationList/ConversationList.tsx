import { css } from './ConversationList.css'
import { ConversationFragment } from 'types/generated/graphql'
import {
  getDateFooterForConversation,
  getSubtitleForConversation,
  getTitleForConversation,
} from '../../util'
import { Flex, InfoTag } from '@hedvig-ui/redesign'
import { TaskResource } from '@hope/features/tasks/list-items/components/task-resource/TaskResource'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import clsx from 'clsx'
import { useChat } from '@hope/features/chat/ChatContext'
import { partitionBy } from '@hedvig-ui'

export function ConversationList() {
  const {
    conversations,
    selectConversation,
    activeTaskConversationId,
    activeClaimConversationId,
  } = useChat()

  const {
    activeTaskConversation,
    activeClaimConversation,
    claimConversations,
    questionConversations,
  } = useConversationTypes({
    conversations,
    activeTaskConversationId,
    activeClaimConversationId,
  })

  return (
    <div className={css.ConversationList}>
      {activeTaskConversation && (
        <div>
          <div className={css.SectionTitle}>This task</div>
          <ConversationListItem
            key={activeTaskConversation.id}
            conversation={activeTaskConversation}
            onSelect={() => selectConversation(activeTaskConversation.id)}
            isActive={true}
          />
        </div>
      )}
      {activeClaimConversation && (
        <div>
          <div className={css.SectionTitle}>This claim</div>
          <ConversationListItem
            key={activeClaimConversation.id}
            conversation={activeClaimConversation}
            onSelect={() => selectConversation(activeClaimConversation.id)}
            isActive={true}
          />
        </div>
      )}
      {claimConversations.length > 0 && (
        <div>
          <div className={css.SectionTitle}>
            Claim{' '}
            <InfoTag variant="neutral">{claimConversations.length}</InfoTag>
          </div>
          {claimConversations
            .toSorted(conversationSortMostRecent)
            .map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                onSelect={() => selectConversation(conversation.id)}
                isActive={false}
              />
            ))}
        </div>
      )}
      {questionConversations.length > 0 && (
        <div>
          <div className={css.SectionTitle}>
            Question{' '}
            <InfoTag variant="neutral">{questionConversations.length}</InfoTag>
          </div>
          {questionConversations
            .toSorted(conversationSortMostRecent)
            .map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                onSelect={() => selectConversation(conversation.id)}
                isActive={false}
              />
            ))}
        </div>
      )}
    </div>
  )
}

function useConversationTypes({
  conversations,
  activeTaskConversationId,
  activeClaimConversationId,
}: {
  conversations: ConversationFragment[]
  activeTaskConversationId?: string
  activeClaimConversationId?: string
}) {
  const conversationsById = new Map(conversations.map((c) => [c.id, c]))

  const activeTaskConversation =
    activeTaskConversationId &&
    conversationsById.pluck(activeTaskConversationId)
  const activeClaimConversation =
    activeClaimConversationId &&
    conversationsById.pluck(activeClaimConversationId)
  const [claimConversations, questionConversations] = partitionBy(
    conversationsById.values(),
    (c) => !!c.claimId,
  )

  return {
    activeTaskConversation,
    activeClaimConversation,
    claimConversations,
    questionConversations,
  }
}

function conversationSortMostRecent(
  a: ConversationFragment,
  b: ConversationFragment,
) {
  const aComparator = a.newestMessage?.timestamp ?? a.createdAt
  const bComparator = b.newestMessage?.timestamp ?? b.createdAt

  return bComparator.localeCompare(aComparator)
}

function ConversationListItem({
  conversation,
  onSelect,
  isActive,
}: {
  conversation: ConversationFragment
  onSelect: () => void
  isActive: boolean
}) {
  const title = getTitleForConversation(conversation)
  const subtitle = getSubtitleForConversation(conversation)
  const dateFooter = getDateFooterForConversation(conversation)
  const badge = conversation.latestTask &&
    !conversation.latestTask.resolvedAt && (
      <TaskResource task={conversation.latestTask} />
    )

  return (
    <div
      key={conversation.id}
      onClick={onSelect}
      className={clsx(css.ConversationListItem.base, {
        [css.ConversationListItem.active]: isActive,
      })}
    >
      <Flex justify="space-between">
        <Flex direction="column" gap="xs">
          <p>{title}</p>
          <p className={cssUtil.textMuted}>{subtitle}</p>
          <p className={cssUtil.textMuted}>{dateFooter}</p>
        </Flex>
        {badge}
      </Flex>
    </div>
  )
}
