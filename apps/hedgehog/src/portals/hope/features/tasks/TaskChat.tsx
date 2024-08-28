import { Task } from 'types/generated/graphql'
import { Chat } from '@hope/features/chat/Chat'

export const TaskChat: React.FC<{
  assignedToMe: boolean
  task: Task
  onResolve: () => Promise<void>
  onReject: () => void
  onMove: (taskId: string, email: string) => void
  navigateToNext: () => void
  onSelectMember: (memberId: string) => void
  userTaskCount: Record<string, number>
  slim?: boolean
}> = (props) => {
  const { slim, ...taskProps } = props
  const memberId = taskProps.task.memberId
  return (
    <Chat.Root>
      {!!memberId && (
        <Chat.Content
          key={taskProps.task.id}
          memberId={memberId}
          defaultConversation={taskProps.task.conversationId ?? undefined}
          claimId={taskProps.task.claimId ?? undefined}
          taskProps={taskProps}
        />
      )}
    </Chat.Root>
  )
}
