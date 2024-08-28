import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import * as React from 'react'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { ClaimPageContent } from '../../claims/ClaimPageContent'
import { MemberPageContent } from '../../member'

interface TaskTab {
  title: string
  type: TabType
  render: () => React.ReactNode
  selected: boolean
  resourceId: string
}

interface UseTaskTabsResult {
  render: () => React.ReactNode
  tabs: TaskTab[]
  selectTab: (resourceId: string) => void
  closeTab: (resourceId: string) => void
  renameTab: (resourceId: string, name: string) => void
}

export type TabType = 'member' | 'claim'

const TaskTabsContext = createContext<UseTaskTabsResult>({
  render: () => null,
  tabs: [],
  selectTab: () => null,
  closeTab: () => null,
  renameTab: () => null,
})

export const useTaskTabs = () => useContext(TaskTabsContext)

export const TaskTabsProvider = ({ children }: { children: ReactNode }) => {
  const [taskNames, setTaskNames] = useState<Record<string, string>>({})
  const {
    taskNavigate,
    params: { memberId, claimIds, tab, active, taskId },
  } = useTaskNavigation()

  const renameTabHandler = useCallback((resourceId: string, name: string) => {
    setTaskNames((prevTaskNames) => ({ ...prevTaskNames, [resourceId]: name }))
  }, [])

  const tabs = useMemo(() => {
    const newTabs: TaskTab[] = []

    if (memberId) {
      newTabs.push({
        title: taskNames[memberId] ?? 'Member',
        render: () => (
          <MemberPageContent
            memberId={memberId}
            tab={tab ?? 'contracts'}
            title=""
            onChangeTab={(newTab) =>
              taskNavigate(
                { memberId, tab: newTab, active: memberId, claimIds, taskId },
                { replace: true },
              )
            }
            onClickClaim={(newClaimId: string) =>
              taskNavigate({
                memberId,
                tab,
                claimIds: [
                  ...claimIds.filter((id) => id !== newClaimId),
                  newClaimId,
                ],
                active: newClaimId,
                taskId,
              })
            }
          />
        ),
        type: 'member',
        resourceId: memberId,
        selected: active === memberId,
      })
    }

    if (claimIds.length) {
      const tabs: TaskTab[] = claimIds.map((id) => {
        return {
          title: taskNames[id] ?? 'Claim',
          render: () => <ClaimPageContent claimId={id} isInboxView={true} />,
          type: 'claim',
          resourceId: id,
          selected: active === id,
        }
      })

      newTabs.push(...tabs)
    }

    return newTabs
  }, [taskNavigate, taskId, memberId, claimIds, tab, active, taskNames])

  const getTab = (resourceId: string) =>
    tabs.find((tab) => tab.resourceId === resourceId)

  const selectTabHandler = (resourceId: string) => {
    if (getTab(resourceId)) {
      taskNavigate({ memberId, tab, claimIds, active: resourceId, taskId })
    }
  }

  const closeTabHandler = (resourceId: string) => {
    if (getTab(resourceId)) {
      taskNavigate({
        memberId,
        tab,
        active: memberId,
        claimIds: claimIds.filter((id) => id !== resourceId),
        taskId,
      })
    }
  }

  const render = () => {
    if (!active) return null

    const tabToRender = getTab(active)

    if (!tabToRender) return null

    return tabToRender.render()
  }

  return (
    <TaskTabsContext.Provider
      value={{
        render,
        tabs,
        selectTab: selectTabHandler,
        closeTab: closeTabHandler,
        renameTab: renameTabHandler,
      }}
    >
      {children}
    </TaskTabsContext.Provider>
  )
}
