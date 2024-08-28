import { addSToName, FadeIn, Footer, Keys, useTitle } from '@hedvig-ui'
import { Button, Card, ClickToCopy, Flex, InfoTag } from '@hedvig-ui/redesign'
import { usePushMemberHistory } from '@hope/common/hooks/use-push-member-history'
import { useEffect, useState } from 'react'
import { CommandHotkey } from '../../commands/components/CommandHotkey'
import { useSidebarLayout } from '@hope/common/components/layouts/SidebarLayout/SidebarLayout'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useTaskTabs } from '@hope/features/tasks/hooks/use-task-tabs'
import { formatDate } from 'date-fns/format'
import { parseISO } from 'date-fns'
import { ClaimUiVersionSwitcher } from '@hope/features/claims/ClaimUiVersionSwitcher'
import { ClaimRestrictionInformationNew } from './ClaimRestrictionInformationNew'
import { ClaimMemberHeader } from './ClaimMemberHeader'
import { memberChatVisibleAtom } from '@hope/features/chat/memberChatVisibleAtom'
import { useSetAtom } from 'jotai'
import { ClaimTabs } from '@hope/features/claims/new/ClaimTabs'
import { ClaimEventsNew } from './ClaimEventsNew'
import { DraggableNoteEditor } from '@hope/features/claims/new/ClaimNotes/DraggableNoteEditor'
import { theme } from '@hedvig-ui/redesign/theme'
import { CopyIcon, PlusIcon } from '@hedvig-ui/icons'
import { ScheduleTaskModal } from '@hope/features/tasks/components/ScheduleTask'
import { TaskResourceType } from 'types/generated/graphql'
import { AssignClaimToAdmin } from '../claim-details/ClaimInformation/components/AssignClaimToAdmin'
import { ExclamationCircle } from 'react-bootstrap-icons'

export const ClaimPageContentInnerNew = ({
  isInboxView = false,
}: {
  isInboxView: boolean
}) => {
  const { renameTab } = useTaskTabs()
  const { collapsed, temporaryView } = useSidebarLayout()
  const { claimId, claimOpenedAt, restriction, member, claimNumber } =
    useClaim()

  useTitle(
    member?.firstName
      ? `${addSToName(member.firstName)} claim`
      : `Claim Details`,
  )

  useEffect(() => {
    if (claimOpenedAt) {
      renameTab(
        claimId,
        `Claim ${claimNumber} (${formatDate(parseISO(claimOpenedAt), 'dd MMMM, yyyy')})`,
      )
    }
  }, [claimOpenedAt, claimId, claimNumber, renameTab])

  usePushMemberHistory(member?.memberId)

  return (
    <>
      <FadeIn>
        <Flex p="large" direction="column" gap="medium">
          <ClaimHeader />

          {!!restriction && (
            <Card>
              <ClaimRestrictionInformationNew />
            </Card>
          )}

          <Card>
            <ClaimMemberHeader isInboxView={isInboxView} />
          </Card>

          <ClaimTabs isInboxView={isInboxView} />

          <ClaimEventsNew />
        </Flex>
      </FadeIn>
      <Footer
        sidebarCollapsed={collapsed && !temporaryView}
        isInboxView={isInboxView}
      >
        <ClaimUiVersionSwitcher />
        <Flex
          justify="flex-end"
          gap="small"
          style={{ width: 'max-content', marginLeft: 'auto' }}
        >
          <DraggableNoteEditor />
          {!isInboxView && <ToggleMemberChatButton />}
        </Flex>
      </Footer>
    </>
  )
}

const ClaimHeader = () => {
  const { claimId, claimOpenedAt } = useClaim()
  return (
    <Flex py="lg" justify="space-between">
      <Flex gap="xs" style={{ fontSize: theme.fontSizes.xl }}>
        Claim
        <Flex gap="xxs">
          <span style={{ color: theme.colors.textSecondary }}>
            {formatDate(new Date(claimOpenedAt), 'dd MMMM y')}
          </span>
          <ClickToCopy value={claimId}>
            <CopyIcon
              fill={theme.colors.textSecondary}
              style={{
                width: 24,
                height: 24,
                translate: '0 4px',
              }}
            />
          </ClickToCopy>
        </Flex>
      </Flex>

      <Flex justify="flex-end" gap="sm">
        <AssignAdmin />
        <ScheduleTask />
      </Flex>
    </Flex>
  )
}

const AssignAdmin = () => {
  const { assignedAdmin } = useClaim()

  if (!assignedAdmin) {
    return null
  }

  return (
    <Button variant="secondary-alt">
      <AssignClaimToAdmin>
        <Flex align="center" gap="xs">
          <ExclamationCircle />
          <span>Assigned to {assignedAdmin.name}</span>
        </Flex>
      </AssignClaimToAdmin>
    </Button>
  )
}

const ScheduleTask = () => {
  const {
    memberId,
    claimId,
    member,
    scheduledTasks,
    lastTaskArea,
    conversation,
    refetch,
  } = useClaim()
  const market = member?.contractMarketInfo?.market

  const [scheduleTask, setScheduleTask] = useState(false)

  if (!market) {
    return null
  }

  return (
    <>
      {scheduledTasks.length ? (
        <div style={{ position: 'relative' }}>
          <Button onClick={() => setScheduleTask(true)}>
            Scheduled tasks{' '}
            <InfoTag variant="neutral">{scheduledTasks.length}</InfoTag>
          </Button>
        </div>
      ) : (
        <Button onClick={() => setScheduleTask(true)}>
          <PlusIcon /> Schedule task
        </Button>
      )}

      <ScheduleTaskModal
        visible={scheduleTask}
        scheduledTasks={scheduledTasks}
        memberId={memberId}
        resourceId={claimId}
        market={market}
        title={`${member?.firstName} ${member?.lastName}`}
        resourceType={TaskResourceType.Claim}
        area={lastTaskArea ?? null}
        onClose={async () => {
          setScheduleTask(false)
          await refetch()
        }}
        conversationId={conversation?.id ?? null}
        claimId={claimId}
      />
    </>
  )
}

const ToggleMemberChatButton = () => {
  const setVisible = useSetAtom(memberChatVisibleAtom)
  const toggleMemberChat = () => setVisible((value) => !value)
  return (
    <CommandHotkey
      text="Toggle Chat"
      keys={[Keys.Option, Keys.C]}
      onResolve={toggleMemberChat}
      side="right"
    >
      <Button variant="secondary" onClick={toggleMemberChat}>
        Chat
      </Button>
    </CommandHotkey>
  )
}
