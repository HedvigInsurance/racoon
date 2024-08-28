import { stringSortByNumberOrText, useLocalStorage } from '@hedvig-ui'
import gql from 'graphql-tag'
import { useMoveTask } from '@hope/features/tasks/hooks/use-move-task'
import { useRejectTask } from '@hope/features/tasks/hooks/use-reject-task'
import { useEffect, useMemo } from 'react'
import {
  Task,
  TaskResourceArea,
  TaskResourceType,
  useAllTasksQuery,
  useGetTaskQuery,
} from 'types/generated/graphql'
import { useTaskTabs } from '@hope/features/tasks/hooks/use-task-tabs'
import { useResolveTask } from '@hope/features/tasks/hooks/use-resolve-task'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { Market } from '@hope/features/config/constants'
import { TaskResourceAreas } from '@hope/features/tasks/constants'
import { isPast, parseISO } from 'date-fns'

gql`
  query AllTasks {
    tasks {
      ...Task
    }
  }

  query GetTask($taskId: ID!) {
    task(id: $taskId) {
      ...Task
    }
  }

  fragment Task on Task {
    id
    memberId
    market
    area
    areaAssignment {
      area
      assignedAt
      assignedBy
      assignedByUser {
        __typename
        ... on AdminSystemUser {
          ...AdminSystemUser
        }
        ... on EmailSystemUser {
          id
          email
          name
        }
        ... on MemberSystemUser {
          memberId
        }
        ... on UnknownSystemUser {
          id
          name
        }
      }
      note
    }
    typeAssignment {
      type
      assignedAt
      assignedBy
    }
    title
    description
    note
    createdAt
    resourceId
    resolvedAt
    resolvedBy
    resourceType
    assignableTo
    assignableFrom
    assignedTo
    assignedAt
    assignReason
    warmth
    claimId
    conversationId
  }
`

export const useTask = (taskId: string) => {
  const { data, error, loading } = useGetTaskQuery({
    variables: { taskId },
    skip: !taskId,
    fetchPolicy: 'cache-first',
  })

  if (error || loading) {
    return null
  }

  return data?.task ?? null
}

interface TasksResult {
  tasks: Task[]
  loading: boolean
}

const useAllTasks = (pollInterval?: number): TasksResult => {
  const { data, loading } = useAllTasksQuery({
    pollInterval,
  })

  const tasks = (data?.tasks ?? []) as Task[]

  return { tasks, loading }
}

interface UseTasksVariables {
  params: {
    taskId?: string | null
  }
  onResolve?: (taskId: string) => void
  onSelect?: (task: Task | null) => void
}

const getTasks = (
  mode: TaskMode,
  assignedTo: string,
  userTasks: Record<string, Task[]>,
  tasks: Task[],
  scheduledTasks: Task[],
): Task[] => {
  switch (mode) {
    case TaskMode.Unassigned:
      return userTasks[TaskMode.Unassigned] ?? []
    case TaskMode.User:
      return userTasks[assignedTo] ?? []
    case TaskMode.Scheduled:
      return scheduledTasks
    case TaskMode.All:
    default:
      return tasks
  }
}

export enum TaskMode {
  User = 'User',
  All = 'All tasks',
  Unassigned = 'Unassigned',
  Scheduled = 'Scheduled',
}

export const useTasks = (
  mode: TaskMode,
  email: string,
  assignedTo: string,
  { onResolve }: UseTasksVariables,
) => {
  const { tasks: allTasks, loading } = useAllTasks(10000)
  const [tasks, scheduledTasks] = useMemo(() => {
    return [
      allTasks.filter(
        (task) =>
          !task.assignableFrom ||
          task.assignedTo ||
          isPast(parseISO(task.assignableFrom)),
      ),
      allTasks.filter(
        (task) =>
          task.assignableFrom &&
          !task.assignedTo &&
          !isPast(parseISO(task.assignableFrom)),
      ),
    ]
  }, [allTasks])

  const {
    taskNavigate,
    params: { taskId },
  } = useTaskNavigation()

  const { move } = useMoveTask()
  const { reject } = useRejectTask()
  const { resolve } = useResolveTask()
  const { render, tabs, selectTab, closeTab } = useTaskTabs()

  const selectedTask = useTask(taskId ?? '')

  const tasksByUser = useMemo(() => {
    return tasks.reduce(
      (tasksByUser, task) => {
        const assignedTo = task.assignedTo ?? (TaskMode.Unassigned as string)
        const userTasks = tasksByUser[assignedTo]
        tasksByUser[assignedTo] = userTasks?.length
          ? [...userTasks, task]
          : [task]
        return tasksByUser
      },
      {} as Record<string, Task[]>,
    )
  }, [tasks])

  const userTaskCount = useMemo(() => {
    return Object.fromEntries(
      Object.entries(tasksByUser)
        .filter(([assignedTo]) => assignedTo !== TaskMode.Unassigned)
        .map(([assignedTo, tasks]) => [assignedTo, tasks.length]),
    ) as Record<string, number>
  }, [tasksByUser])

  const tabTaskCount = useMemo(() => {
    return Object.values(TaskMode).reduce(
      (tabTaskCount, tab) => {
        tabTaskCount[tab] = getTasks(
          tab,
          email,
          tasksByUser,
          tasks,
          scheduledTasks,
        ).length
        return tabTaskCount
      },
      {} as Record<TaskMode, number>,
    )
  }, [email, tasks, tasksByUser, scheduledTasks])

  const currentTasks = useMemo(() => {
    return getTasks(mode, assignedTo, tasksByUser, tasks, scheduledTasks)
  }, [assignedTo, mode, tasks, tasksByUser, scheduledTasks])

  const navigateToNext = () => {
    const selectedTaskIndex = currentTasks.findIndex(
      (task) => task.id === selectedTask?.id,
    )

    if (selectedTaskIndex !== -1) {
      const hasMoreTasks = selectedTaskIndex < currentTasks.length - 1

      if (currentTasks.length > 0 && hasMoreTasks) {
        const nextTask = currentTasks[selectedTaskIndex + 1]
        taskNavigate({ taskId: nextTask.id })
      }

      if (currentTasks.length > 0 && !hasMoreTasks) {
        const nextTask = currentTasks[0]
        taskNavigate({ taskId: nextTask.id })
      }
    }
  }

  const moveTaskHandler = async (
    taskId: string,
    email: string,
    autoSelect = true,
  ) => {
    await move(taskId, email)

    if (!autoSelect) return

    navigateToNext()
  }

  const rejectTaskHandler = async (taskId: string, autoSelect = true) => {
    reject(taskId)

    if (!autoSelect) return

    navigateToNext()
  }

  const resolveTaskHandler = async (taskId: string, autoSelect = true) => {
    await resolve(taskId)
    onResolve?.(taskId)

    if (!autoSelect) return

    navigateToNext()
  }

  const [sortDirection, setSortDirection] = useLocalStorage(
    'hvg:task-list-sort-direction',
    1,
  )
  const [sortField, setSortField] = useLocalStorage<'createdAt' | ''>(
    'hvg:task-list-sort-field',
    '',
  )

  const selectSortField = (newSortField: 'createdAt') => {
    if (sortField === newSortField) {
      setSortDirection((prev) => prev * -1)
      return
    }
    setSortField(newSortField)
  }

  const [selectedResourceTypes, setSelectedResourceTypes] = useLocalStorage<
    TaskResourceType[]
  >('hvg:tasks-selected-resource-types', [])

  const [selectedAreas, setSelectedAreas] = useLocalStorage<
    (TaskResourceArea | null)[]
  >('hvg:tasks-selected-resource-areas', [])

  const [selectedMarkets, setSelectedMarkets] = useLocalStorage<Market[]>(
    'hvg:tasks-selected-markets',
    [],
  )

  // Since we use localStorage, don't keep it in there if it doesn't exist
  useEffect(() => {
    const availableAreas = [...TaskResourceAreas, null]
    if (
      selectedAreas.some(
        (area) =>
          !availableAreas.some(
            (availableArea) => area === (availableArea?.value ?? null),
          ),
      )
    ) {
      setSelectedAreas((prev) =>
        prev.filter((area) =>
          availableAreas.some(
            (availableArea) => area === (availableArea?.value ?? null),
          ),
        ),
      )
    }
    const availableTypes = Object.values(TaskResourceType)
    if (selectedResourceTypes.some((type) => !availableTypes.includes(type))) {
      setSelectedResourceTypes((prev) =>
        prev.filter((type) => availableTypes.includes(type)),
      )
    }
    const availableMarkets = Object.values(Market)
    if (selectedMarkets.some((market) => !availableMarkets.includes(market))) {
      setSelectedMarkets((prev) =>
        prev.filter((market) => availableMarkets.includes(market)),
      )
    }
  }, [
    selectedResourceTypes,
    setSelectedResourceTypes,
    selectedAreas,
    setSelectedAreas,
    selectedMarkets,
    setSelectedMarkets,
  ])

  const toggleArea = (area: TaskResourceArea | null) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((prevArea) => prevArea !== area)
        : [...prev, area],
    )
  }

  const toggleResourceType = (type: TaskResourceType) => {
    setSelectedResourceTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((selected) => selected !== type)
        : [...prevTypes, type],
    )
  }

  const toggleMarket = (market: Market) => {
    setSelectedMarkets((prevMarkets) =>
      prevMarkets.includes(market)
        ? prevMarkets.filter((selected) => selected !== market)
        : [...prevMarkets, market],
    )
  }

  const [filterAssignableTo, setFilterAssignableTo] = useLocalStorage<string>(
    'hvg:tasks-filter-assignable-to',
    '',
  )

  const filteredTasks = useMemo(() => {
    let relevantTasks = currentTasks
    if (mode === TaskMode.Scheduled) {
      if (
        currentTasks.some((task) => task.assignableTo === filterAssignableTo)
      ) {
        relevantTasks = relevantTasks.filter(
          (task) => task.assignableTo === filterAssignableTo,
        )
      }
    }

    if (selectedResourceTypes.length === 0) return relevantTasks
    return relevantTasks.filter((task) =>
      selectedResourceTypes.includes(task.resourceType),
    )
  }, [currentTasks, selectedResourceTypes, filterAssignableTo, mode])

  const sortedAndFilteredTasks = useMemo(() => {
    if (!sortField || !sortDirection) return filteredTasks
    return [...filteredTasks].sort((a, b) => {
      if (sortField === 'createdAt') {
        return (
          sortDirection *
          stringSortByNumberOrText(
            a.assignableFrom ?? a.createdAt,
            b.assignableFrom ?? b.createdAt,
          )
        )
      }
      return 0
    })
  }, [filteredTasks, sortDirection, sortField])

  const [
    questionTasksCount,
    claimTasksCount,
    newClaimTasksCount,
    staleClaimTasksCount,
  ] = currentTasks.reduce(
    (
      [
        questionTasksCount,
        claimTasksCount,
        newClaimTasksCount,
        staleClaimTasksCount,
      ],
      task,
    ) => [
      questionTasksCount +
        (task.resourceType === TaskResourceType.Question ? 1 : 0),
      claimTasksCount + (task.resourceType === TaskResourceType.Claim ? 1 : 0),
      newClaimTasksCount +
        (task.resourceType === TaskResourceType.NewClaim ? 1 : 0),
      staleClaimTasksCount +
        (task.resourceType === TaskResourceType.StaleClaim ? 1 : 0),
    ],
    [0, 0, 0, 0],
  )

  return {
    allTasks: tasks,
    tasks: sortedAndFilteredTasks,
    tabTaskCount,
    userTaskCount,
    loading,
    activeTask: selectedTask,
    resolveTask: resolveTaskHandler,
    rejectTask: rejectTaskHandler,
    moveTask: moveTaskHandler,
    navigateToNext,
    render,
    tabs,
    selectTab,
    closeTab,
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
  }
}
