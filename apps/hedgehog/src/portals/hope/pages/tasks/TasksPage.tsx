import {
  addSToName,
  convertEmailToName,
  convertEnumToTitle,
  groupBy,
  InfoTag,
  Paragraph,
  Popover,
  Spinner,
  StandaloneMessage,
  useConfirmDialog,
  useLocalStorage,
  useMediaQuery,
  useTitle,
} from '@hedvig-ui'
import { CheckInMessage } from '@hope/features/tasks/CheckInMessage'
import { PreferencesModal } from '@hope/features/tasks/components/PreferencesModal'
import { useUserStatus } from '@hope/features/tasks/hooks/use-user-status'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { TaskMode, useTasks } from '@hope/features/tasks/hooks/use-tasks'
import { ClaimTaskListItem } from '@hope/features/tasks/list-items/ClaimTaskListItem'
import { QuestionTaskListItem } from '@hope/features/tasks/list-items/QuestionTaskListItem'
import { TaskListItem } from '@hope/features/tasks/list-items/TaskListItem'
import { useMe } from '@hope/features/user/hooks/use-me'
import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  InfoCircle,
} from 'react-bootstrap-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { TaskResourceArea, TaskResourceType } from 'types/generated/graphql'
import { TaskChat } from '../../features/tasks/TaskChat'
import { useTemplateMessages } from '../../features/template-messages/use-template-messages'
import CheckedInUsers from '@hope/features/tasks/components/CheckedInUsers'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import { TaskTabsProvider } from '@hope/features/tasks/hooks/use-task-tabs'
import { Market, MarketFlags } from '@hope/features/config/constants'
import {
  TaskResourceAreaIcon,
  TaskResourceAreaName,
  TaskResourceAreas,
} from '@hope/features/tasks/constants'
import { format, parseISO } from 'date-fns'
import { inTenMinutes } from '../../features/config/utils/time'
import {
  Button,
  Div,
  Dropdown,
  Flex,
  InfoTag as InfoTagNew,
  LegacyTooltip,
} from '@hedvig-ui/redesign'
import { TasksNavigation } from './components'
import { css } from './TasksPage.css'
import { IconButton } from '@hedvig-ui/icons'
import toast from 'react-hot-toast'

const SortField = ({
  children,
  sortDirection,
  isSelected,
  onClick,
}: {
  children: ReactNode
  sortDirection: number
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <Flex
      align="center"
      gap="md"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {children}
      <IconButton variant={isSelected ? 'secondary' : 'ghost'}>
        {sortDirection < 0 ? <ArrowUp /> : <ArrowDown />}
      </IconButton>
    </Flex>
  )
}

const WaitingMessage = ({ children }: { children: ReactNode }) => (
  <StandaloneMessage>
    <div
      style={{
        width: '100%',
        padding: '2rem 4rem',
        display: 'grid',
        placeItems: 'center',
        gap: '0.5rem',
      }}
    >
      {children}
    </div>
  </StandaloneMessage>
)

const TasksPageInner = () => {
  const { hasPermission: hasExploreInboxPermission } =
    useHasPermission('exploreInbox')

  const isMobile = useMediaQuery('(max-width: 800px)')
  const navigate = useNavigate()
  const location = useLocation()
  const {
    checkedIn,
    checkOut,
    pauseTaskDistribution,
    taskDistributionPausedMinutes,
  } = useUserStatus()
  const [showPreferences, setShowPreferences] = useState(false)
  const {
    me: { email },
  } = useMe()
  const [mode, setMode] = useLocalStorage<TaskMode>(
    'hvg:task-mode',
    TaskMode.User,
  )
  const [assignedTo, setAssignedTo] = useState(email)
  const { confirm } = useConfirmDialog()

  const {
    taskNavigate,
    params: { memberId, taskId },
  } = useTaskNavigation()

  const { changeActiveMember } = useTemplateMessages()

  const {
    allTasks,
    tasks,
    tabTaskCount,
    userTaskCount,
    activeTask,
    resolveTask,
    rejectTask,
    moveTask,
    render,
    tabs,
    selectTab,
    closeTab,
    navigateToNext,
    sortField,
    selectSortField,
    sortDirection,
    selectedResourceTypes,
    toggleResourceType,
    questionTasksCount,
    claimTasksCount,
    newClaimTasksCount,
    staleClaimTasksCount,
    selectedAreas,
    toggleArea,
    selectedMarkets,
    toggleMarket,
    filterAssignableTo,
    setFilterAssignableTo,
    scheduledTasks,
  } = useTasks(mode, email, assignedTo, {
    params: { taskId },
    onResolve: () => navigate(`/inbox`, { replace: true }),
  })

  const title = `Inbox(${userTaskCount[email] ?? 0}) - ${
    tabTaskCount[TaskMode.All]
  } total`

  useTitle(title)

  useEffect(() => {
    const memberId = activeTask?.memberId
    changeActiveMember(memberId)
  }, [activeTask, changeActiveMember])

  const navigateHandler = (taskId: string) => {
    taskNavigate({
      taskId,
    })
  }

  const [isWaitingForTasks, setIsWaitingForTasks] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const hasAssignedTasks = !!allTasks.filter(
      (task) => task?.assignedTo === email,
    ).length

    if (checkedIn && !hasAssignedTasks) {
      timeout = setTimeout(() => {
        setIsWaitingForTasks(false)
      }, 15000)

      if (!isWaitingForTasks) {
        setIsWaitingForTasks(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [checkedIn, isWaitingForTasks, allTasks, email])

  const tasksPerArea = useMemo(
    () =>
      tasks.reduce(
        (tasksPerArea, task) => {
          const taskArea = task.area as TaskResourceArea | 'null'
          if (!tasksPerArea[taskArea]) {
            tasksPerArea[taskArea] = 1
            return tasksPerArea
          }
          tasksPerArea[taskArea] += 1
          return tasksPerArea
        },
        {} as Record<TaskResourceArea | 'null', number>,
      ),
    [tasks],
  )

  const tasksPerMarket = useMemo(
    () =>
      tasks.reduce(
        (tasksPerMarket, task) => {
          const taskMarket = task.market as Market
          if (!tasksPerMarket[taskMarket]) {
            tasksPerMarket[taskMarket] = 1
            return tasksPerMarket
          }
          tasksPerMarket[taskMarket] += 1
          return tasksPerMarket
        },
        {} as Record<Market, number>,
      ),
    [tasks],
  )

  const areaChildren = (area: TaskResourceArea) => {
    return [...TaskResourceAreas]
      .filter(({ parent }) => parent === area)
      .map(({ value }) => value)
  }

  const hasSelectedChild = (area: TaskResourceArea) => {
    const children = areaChildren(area)
    return selectedAreas.some(
      (selectedArea) => selectedArea != null && children.includes(selectedArea),
    )
  }

  const toggleParentArea = (parent: TaskResourceArea) => {
    if (selectedAreas.includes(parent)) {
      toggleArea(parent)
    }
    areaChildren(parent)
      .filter((childArea) => selectedAreas.includes(childArea))
      .forEach((childArea) => toggleArea(childArea))
  }

  const resourceFilters = [
    {
      resource: TaskResourceType.Question,
      title: 'Question',
      count: questionTasksCount,
    },
    {
      resource: TaskResourceType.Claim,
      title: 'Claim',
      count: claimTasksCount,
    },
    {
      resource: TaskResourceType.NewClaim,
      title: 'New claim',
      count: newClaimTasksCount,
    },
    {
      resource: TaskResourceType.StaleClaim,
      title: 'Stale',
      count: staleClaimTasksCount,
    },
  ]

  const shouldShowCheckInBar = !checkedIn && !memberId
  const shouldShowFilterBar = !memberId

  const scheduledTasksFilterAdminOptions = Object.entries(
    groupBy(scheduledTasks, (task) => String(task.assignableTo)),
  ).map(([assignableTo, tasks]) =>
    assignableTo === 'null'
      ? {
          label: `Anyone (${scheduledTasks.length})`,
          value: '',
          action: () => setFilterAssignableTo(''),
          selected: filterAssignableTo === '',
        }
      : {
          label: `${convertEmailToName(assignableTo)} (${tasks.length})`,
          value: assignableTo,
          action: () => setFilterAssignableTo(assignableTo),
          selected: filterAssignableTo === assignableTo,
        },
  )

  return (
    <>
      {isMobile && activeTask && (
        <div
          className={css.backButtonContainer}
          onClick={() => {
            navigate('/inbox')
          }}
        >
          <ChevronLeft />
        </div>
      )}
      <div className={css.wrapper}>
        <TasksNavigation>
          <TasksNavigation.TopBar>
            {tabs.length === 0 ? (
              <>
                {(hasExploreInboxPermission
                  ? Object.values(TaskMode)
                  : [TaskMode.User]
                ).map((taskMode) => (
                  <TasksNavigation.TopBar.Item
                    key={taskMode}
                    selected={
                      !memberId && taskMode === mode && assignedTo === email
                    }
                    onClick={() => {
                      setAssignedTo(email)
                      setMode(taskMode)
                      navigate('/inbox')
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <span>
                        {taskMode !== TaskMode.User ? taskMode : 'My inbox'}
                      </span>
                      <InfoTagNew variant="neutral">
                        {tabTaskCount[taskMode]}
                      </InfoTagNew>
                    </Flex>
                  </TasksNavigation.TopBar.Item>
                ))}
                {assignedTo !== email && (
                  <TasksNavigation.TopBar.Item selected={true}>
                    {addSToName(convertEmailToName(assignedTo))} inbox (
                    {userTaskCount[assignedTo] ?? 0})
                    <TasksNavigation.TopBar.Item.CloseTrigger
                      onClick={() => {
                        setAssignedTo(email)
                      }}
                    />
                  </TasksNavigation.TopBar.Item>
                )}
                {hasExploreInboxPermission && (
                  <div style={{ marginLeft: 'auto' }}>
                    <CheckedInUsers
                      assignedTo={assignedTo}
                      setAssignedTo={(assignedTo) => {
                        taskNavigate({ taskId: null })
                        setAssignedTo(assignedTo)
                      }}
                      setMode={setMode}
                      userTaskCount={userTaskCount}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <TasksNavigation.TopBar.Item
                  selected={!memberId}
                  onClick={() => navigate(`/inbox`)}
                >
                  <Flex align="center" gap="sm">
                    <ChevronLeft />
                    Back
                  </Flex>
                </TasksNavigation.TopBar.Item>

                {tabs.map(({ selected, title, resourceId, type }, index) => (
                  <TasksNavigation.TopBar.Item
                    key={title + index}
                    selected={selected}
                    onClick={() => selectTab(resourceId)}
                  >
                    <p>{title}</p>
                    {type === 'claim' && (
                      <TasksNavigation.TopBar.Item.CloseTrigger
                        onClick={(e) => {
                          closeTab(resourceId)
                          e.stopPropagation()
                        }}
                      />
                    )}
                  </TasksNavigation.TopBar.Item>
                ))}
              </>
            )}
          </TasksNavigation.TopBar>

          {!!activeTask?.note && (
            <InfoTag
              style={{ padding: '1rem', margin: '1rem' }}
              status="success"
            >
              <Flex justify="between">
                <Flex gap="small" align="center">
                  <Popover
                    position="right"
                    contents={
                      <div>
                        {
                          <Paragraph>
                            Assignable to:
                            <br />
                            {activeTask.assignableTo
                              ? convertEmailToName(activeTask.assignableTo)
                              : 'Anyone'}
                          </Paragraph>
                        }
                        {
                          <Paragraph>
                            Assignable from:
                            <br />
                            {activeTask.assignableFrom
                              ? format(
                                  parseISO(activeTask.assignableFrom),
                                  'yyyy-MM-dd HH:mm:ss',
                                )
                              : 'Now'}
                          </Paragraph>
                        }
                      </div>
                    }
                  >
                    <InfoCircle />
                  </Popover>
                  <Paragraph>{activeTask.note}</Paragraph>
                </Flex>
              </Flex>
            </InfoTag>
          )}

          {shouldShowCheckInBar && (
            <TasksNavigation.CheckInBar>
              <CheckInMessage />
            </TasksNavigation.CheckInBar>
          )}

          {shouldShowFilterBar && (
            <TasksNavigation.FilterBar>
              <Flex direction="column" gap="small">
                <Flex wrap="wrap" gap="small">
                  {resourceFilters.map((resourceFilterItem) => (
                    <TasksNavigation.FilterBar.Item
                      key={resourceFilterItem.resource}
                      text={resourceFilterItem.title}
                      count={resourceFilterItem.count}
                      selected={selectedResourceTypes.includes(
                        resourceFilterItem.resource,
                      )}
                      onClick={() =>
                        toggleResourceType(resourceFilterItem.resource)
                      }
                    />
                  ))}
                </Flex>

                {mode === TaskMode.Scheduled && (
                  <Div mt="small">
                    <Dropdown
                      label="Filter admin"
                      options={scheduledTasksFilterAdminOptions}
                    />
                  </Div>
                )}

                {(mode === TaskMode.All || mode === TaskMode.Unassigned) && (
                  <>
                    <Flex wrap="wrap" gap="small">
                      {Object.values(Market).map((market) => (
                        <TasksNavigation.FilterBar.Item
                          key={market}
                          text={MarketFlags[market]}
                          count={tasksPerMarket[market] ?? 0}
                          popoverContent={
                            market ? convertEnumToTitle(market) : 'None'
                          }
                          selected={selectedMarkets.includes(market)}
                          onClick={() => toggleMarket(market)}
                        />
                      ))}
                    </Flex>

                    <Flex wrap="wrap" gap="small">
                      {[...TaskResourceAreas].map((area) => {
                        const childAreasTasksCount = areaChildren(
                          area.value,
                        ).reduce(
                          (sum, childArea) =>
                            sum + (tasksPerArea[childArea] ?? 0),
                          0,
                        )
                        return area.parent ? null : (
                          <Fragment key={area.value}>
                            {areaChildren(area.value).length &&
                            (selectedAreas.includes(area.value) ||
                              hasSelectedChild(area.value)) ? (
                              <div>
                                <TasksNavigation.FilterBar.Item
                                  style={{ width: '100%' }}
                                  text={`${TaskResourceAreaIcon[area.value]} ${TaskResourceAreaName[area.value]}`}
                                  count={
                                    (tasksPerArea[area.value] ?? 0) +
                                    childAreasTasksCount
                                  }
                                  partiallySelected={true}
                                  onClick={() => toggleParentArea(area.value)}
                                />

                                <Flex
                                  gap="tiny"
                                  style={{ marginTop: '0.5rem' }}
                                >
                                  <LegacyTooltip
                                    key={area.value}
                                    content={TaskResourceAreaName[area.value]}
                                  >
                                    <TasksNavigation.FilterBar.Item
                                      text={TaskResourceAreaIcon[area.value]}
                                      count={tasksPerArea[area.value] ?? 0}
                                      selected={selectedAreas.includes(
                                        area.value,
                                      )}
                                      onClick={() => toggleArea(area.value)}
                                    />
                                  </LegacyTooltip>
                                  {areaChildren(area.value).map((childArea) => (
                                    <TasksNavigation.FilterBar.Item
                                      key={childArea}
                                      text={TaskResourceAreaIcon[childArea]}
                                      popoverContent={
                                        TaskResourceAreaName[childArea]
                                      }
                                      count={tasksPerArea[childArea] ?? 0}
                                      selected={selectedAreas.includes(
                                        childArea,
                                      )}
                                      onClick={() => toggleArea(childArea)}
                                    />
                                  ))}
                                </Flex>
                              </div>
                            ) : (
                              <TasksNavigation.FilterBar.Item
                                text={TaskResourceAreaIcon[area.value]}
                                count={
                                  (tasksPerArea[area.value] ?? 0) +
                                  childAreasTasksCount
                                }
                                popoverContent={
                                  TaskResourceAreaName[area.value]
                                }
                                selected={selectedAreas.includes(area.value)}
                                onClick={() => toggleArea(area.value)}
                              />
                            )}
                          </Fragment>
                        )
                      })}
                      <TasksNavigation.FilterBar.Item
                        text="📬"
                        count={tasksPerArea['null'] ?? 0}
                        popoverContent="None"
                        selected={selectedAreas.includes(null)}
                        onClick={() => toggleArea(null)}
                      />
                    </Flex>
                  </>
                )}
              </Flex>
              <Flex direction="column" gap="small" align="flex-end">
                {hasExploreInboxPermission && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowPreferences(true)}
                  >
                    Preferences
                  </Button>
                )}
                {assignedTo !== email && (
                  <Button
                    variant="secondary-alt"
                    onClick={async () => {
                      await confirm(
                        `Are you sure you want to check out ${convertEmailToName(
                          assignedTo,
                        )}`,
                      )

                      await checkOut(assignedTo)
                      setAssignedTo(email)
                    }}
                  >
                    ⚠️ Check out {convertEmailToName(assignedTo)}
                  </Button>
                )}
                {assignedTo == email && checkedIn && (
                  <LegacyTooltip
                    content={
                      taskDistributionPausedMinutes
                        ? 'Click to refresh stop'
                        : 'Stop member assignments for 10 minutes'
                    }
                  >
                    <Button
                      onClick={() => pauseTaskDistribution(inTenMinutes)}
                      variant="danger"
                    >
                      {taskDistributionPausedMinutes
                        ? `${taskDistributionPausedMinutes} min`
                        : 'Stop assignments'}
                    </Button>
                  </LegacyTooltip>
                )}
              </Flex>
            </TasksNavigation.FilterBar>
          )}

          {!memberId ? (
            <>
              {tasks.length > 0 && (
                <Flex justify="flex-end" px="xl" pb="xs">
                  <SortField
                    sortDirection={sortDirection}
                    isSelected={sortField === 'createdAt'}
                    onClick={() => selectSortField('createdAt')}
                  >
                    Time
                  </SortField>
                </Flex>
              )}

              <ul style={{ overflowY: 'scroll' }}>
                {mode === TaskMode.User &&
                  checkedIn &&
                  !allTasks.filter((task) => task?.assignedTo === email)
                    .length && (
                    <WaitingMessage>
                      {isWaitingForTasks ? (
                        <>
                          <Spinner />
                          Assigning tasks to you...
                        </>
                      ) : (
                        'Could not find tasks according to your preferences. Your list will update when there are tasks assigned to you'
                      )}
                    </WaitingMessage>
                  )}
                {tasks
                  .filter((task) => {
                    return (
                      (selectedResourceTypes.includes(task.resourceType) ||
                        selectedResourceTypes.length === 0) &&
                      ((mode !== TaskMode.All &&
                        mode !== TaskMode.Unassigned) ||
                        !selectedAreas.length ||
                        selectedAreas.includes(
                          task.area as TaskResourceArea,
                        )) &&
                      ((mode !== TaskMode.All &&
                        mode !== TaskMode.Unassigned) ||
                        !selectedMarkets.length ||
                        selectedMarkets.includes(task.market as Market))
                    )
                  })
                  .map((task, index, array) => {
                    const nextTaskId = array[index + 1]?.id
                    const prevTaskId = array[index - 1]?.id

                    const isTaskOpened = location.search

                    const autoFocus = isTaskOpened
                      ? task.id === activeTask?.id
                      : index === 0

                    switch (task.resourceType) {
                      case TaskResourceType.Question:
                        return (
                          <QuestionTaskListItem
                            key={task.id}
                            assignedToMe={email === task.assignedTo}
                            navigateOnRender={autoFocus}
                            disabled={!checkedIn}
                            task={task}
                            selected={task.id === activeTask?.id}
                            nextTaskId={nextTaskId}
                            prevTaskId={prevTaskId}
                            autoFocus={autoFocus}
                            navigateHandler={navigateHandler}
                            track={tasks.length}
                            onMove={(taskId, email) => moveTask(taskId, email)}
                            userTaskCount={userTaskCount}
                            onReject={() => rejectTask(task.id, !isMobile)}
                            onResolve={() => resolveTask(task.id, !isMobile)}
                          />
                        )
                      case TaskResourceType.Claim:
                      case TaskResourceType.NewClaim:
                      case TaskResourceType.StaleClaim:
                        return (
                          <ClaimTaskListItem
                            key={task.id}
                            assignedToMe={email === task.assignedTo}
                            navigateOnRender={autoFocus}
                            disabled={!checkedIn}
                            task={task}
                            selected={task.id === activeTask?.id}
                            nextTaskId={nextTaskId}
                            prevTaskId={prevTaskId}
                            autoFocus={autoFocus}
                            navigateHandler={navigateHandler}
                            track={tasks.length}
                            onMove={(taskId, email) => moveTask(taskId, email)}
                            userTaskCount={userTaskCount}
                            onReject={() => rejectTask(task.id, !isMobile)}
                            onResolve={() => resolveTask(task.id, !isMobile)}
                          />
                        )
                      default:
                        return (
                          <TaskListItem
                            key={task.id}
                            assignedToMe={email === task.assignedTo}
                            navigateOnRender={autoFocus}
                            disabled={!checkedIn}
                            task={task}
                            onClick={() => taskNavigate({ taskId: task.id })}
                            selected={task.id === activeTask?.id}
                            nextTaskId={nextTaskId}
                            prevTaskId={prevTaskId}
                            autoFocus={autoFocus}
                            navigateHandler={navigateHandler}
                            track={tasks.length}
                            onMove={(taskId, email) => moveTask(taskId, email)}
                            userTaskCount={userTaskCount}
                            onReject={() => rejectTask(task.id, !isMobile)}
                            onResolve={() => resolveTask(task.id, !isMobile)}
                          />
                        )
                    }
                  })}
              </ul>
            </>
          ) : (
            <div style={{ overflowY: 'scroll', height: '100%' }}>
              {render()}
            </div>
          )}
        </TasksNavigation>
        {activeTask !== null && (
          <TaskChat
            slim={isMobile}
            assignedToMe={activeTask.assignedTo === email}
            task={activeTask}
            userTaskCount={userTaskCount}
            navigateToNext={navigateToNext}
            onResolve={() => {
              if (!activeTask) {
                toast.error('No task selected')
                return Promise.reject('No task selected')
              }
              return resolveTask(activeTask.id, !isMobile)
            }}
            onReject={() => rejectTask(activeTask.id, !isMobile)}
            onMove={(taskId, email) => moveTask(taskId, email)}
            onSelectMember={(memberId) => {
              if (!activeTask) {
                return
              }

              taskNavigate({
                memberId,
                active: memberId,
                taskId,
              })
            }}
          />
        )}
      </div>

      <PreferencesModal
        visible={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  )
}

const TasksPage = () => {
  return (
    <TaskTabsProvider>
      <TasksPageInner />
    </TaskTabsProvider>
  )
}

export default TasksPage
