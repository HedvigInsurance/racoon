import { useNavigate } from 'react-router-dom'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { Div, InfoTag, Tabs } from '@hedvig-ui/redesign'
import { ClaimOverviewNew } from '@hope/features/claims/new/ClaimOverviewNew'
import { ClaimNotesNew } from '@hope/features/claims/new/ClaimNotes/ClaimNotesNew'
import { ClaimHistory } from '@hope/features/claims/new/History/ClaimHistory'
import { ClaimItemsNew } from '@hope/features/claims/new/ClaimItems/ClaimItemsNew'
import { ClaimRecoveryNew } from '@hope/features/claims/new/ClaimRecoveryNew'
import { ClaimPaymentOrdersNew } from '@hope/features/claims/new/PaymentOrder/ClaimPaymentOrdersNew'
import { ClaimReservesNew } from './ClaimReservesNew'
import { useSearchParamsState } from '@hedvig-ui'
import { ClaimFilesNew } from '@hope/features/claims/new/ClaimFiles/ClaimFilesNew'

type TabKey =
  | 'overview'
  | 'notes'
  | 'reserves'
  | 'payouts'
  | 'files'
  | 'items'
  | 'history'
  | 'recovery'
type Tab = {
  value: TabKey
  title: string
  badgeCount?: number
}
type Tabs = Tab[]

export const ClaimTabs = ({ isInboxView }: { isInboxView: boolean }) => {
  const {
    claimId,
    notes,
    memberId,
    member: { claims },
    files,
    items,
    subclaims,
  } = useClaim()

  const navigate = useNavigate()
  const {
    taskNavigate,
    params: { tab: taskTab, taskId, claimIds },
  } = useTaskNavigation()

  const missingReserve = subclaims.some((s) => s.reserves.length === 0)

  const TABS = [
    { value: 'overview', title: 'Overview', badge: undefined },
    {
      value: 'notes',
      title: 'Notes',
      badge: { content: notes.length, status: 'neutral' },
    },
    {
      value: 'reserves',
      title: 'Reserves',
      badge: {
        content: missingReserve ? '!' : undefined,
        status: 'warning',
      },
    },
    {
      value: 'payouts',
      title: 'Payouts',
      badge: {
        content: subclaims.flatMap((s) => s.paymentOrders).length,
        status: 'neutral',
      },
    },
    {
      value: 'files',
      title: 'Files',
      badge: { content: files.length, status: 'neutral' },
    },
    {
      value: 'items',
      title: 'Items',
      badge: { content: items.length, status: 'neutral' },
    },
    {
      value: 'history',
      title: 'History',
      badge: {
        content: claims.filter(({ id }) => id !== claimId).length,
        status: 'neutral',
      },
    },
    { value: 'recovery', title: 'Recovery', badge: undefined },
  ] as const

  const [selectedTab, setSelectedTab] = useSearchParamsState(
    'claimTab',
    'overview',
  )

  return (
    <>
      <Tabs
        list={TABS.map(({ value, title, badge }) => {
          return {
            title,
            action: () => setSelectedTab(value),
            active: selectedTab === value,
            key: value,
            badge: badge?.content ? (
              <InfoTag variant={badge.status}>{badge.content}</InfoTag>
            ) : null,
          }
        })}
      />
      <Div>
        {selectedTab === 'overview' && <ClaimOverviewNew />}

        {selectedTab === 'notes' && <ClaimNotesNew />}

        {selectedTab === 'reserves' && <ClaimReservesNew />}

        {selectedTab === 'payouts' && <ClaimPaymentOrdersNew />}

        {selectedTab === 'files' && <ClaimFilesNew />}

        {selectedTab === 'items' && <ClaimItemsNew />}

        {selectedTab === 'history' && (
          <ClaimHistory
            onClickClaim={
              isInboxView
                ? (newClaimId: string) =>
                    taskNavigate({
                      memberId,
                      tab: taskTab,
                      claimIds: [
                        ...claimIds.filter((id) => id !== newClaimId),
                        newClaimId,
                      ],
                      active: newClaimId,
                      taskId,
                    })
                : (claimId) => navigate(`/claims/${claimId}`)
            }
          />
        )}

        {selectedTab === 'recovery' && <ClaimRecoveryNew />}
      </Div>
    </>
  )
}
