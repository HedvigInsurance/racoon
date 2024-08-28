import { TaskDashboardDataFragment } from 'types/generated/graphql'
import styled from '@emotion/styled'
import { Spacing, ThirdLevelHeadline, Flex } from '@hedvig-ui'
import { TaskDataHistogram } from './TaskDataHistogram'
import { TaskMetricTable } from './TaskMetricTable'

const TaskCard = styled.div`
  background-color: ${({ theme }) => theme.accentLighter};
  display: flex;
  gap: 2rem;
  padding: 0.5rem;
  max-width: 11rem;
  font-size: ${({ theme }) => theme.fontSize.medium};
`
const TaskCardText = styled.div`
  &.red {
    color: ${({ theme }) => theme.danger};
  }
  &.mute {
    opacity: 0.3;
  }
`
const TaskCardNumber = styled.div`
  background-color: white;
  font-size: ${({ theme }) => theme.fontSize.small};
  width: 1.8rem;
  text-align: center;
`

interface TasksDataProps {
  tasks: ReadonlyArray<TaskDashboardDataFragment>
}

export const TasksData = ({ tasks }: TasksDataProps) => {
  const unassignedTasks = tasks.filter((task) => !task.assignedTo)

  return (
    <Spacing bottom="large">
      <ThirdLevelHeadline>Tasks in the inbox</ThirdLevelHeadline>
      <Flex gap="tiny">
        <TaskCard>
          <TaskCardText>All</TaskCardText>
          <TaskCardNumber>{tasks.length}</TaskCardNumber>
        </TaskCard>
        <TaskCard>
          <TaskCardText className={unassignedTasks.length > 0 ? 'red' : 'mute'}>
            <TaskCardText>Unassigned</TaskCardText>
          </TaskCardText>
          <TaskCardNumber>{unassignedTasks.length}</TaskCardNumber>
        </TaskCard>
      </Flex>
      <TaskDataHistogram tasks={tasks} />
      <TaskMetricTable tasks={tasks} />
    </Spacing>
  )
}
