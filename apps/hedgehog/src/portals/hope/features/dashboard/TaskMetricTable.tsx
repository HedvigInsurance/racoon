import {
  Spacing,
  ThirdLevelHeadline,
  Flex,
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableColumn,
} from '@hedvig-ui'
import {
  TaskDashboardDataFragment,
  TaskResourceArea,
} from 'types/generated/graphql'
import { useUsers } from '../user/hooks/use-users'
import {
  TaskResourceAreaIcon,
  TaskResourceAreaName,
  TaskResourceAreas,
} from '@hope/features/tasks/constants'

interface TasksDataProps {
  tasks: ReadonlyArray<TaskDashboardDataFragment>
}

export const TaskMetricTable = ({ tasks }: TasksDataProps) => {
  const { checkedInUsers } = useUsers()

  const areaUsers = checkedInUsers.reduce(
    (areaUsers, user) => {
      user.areas.forEach((area) => {
        const areaOrNull = area ?? 'UNSPECIFIED'
        if (areaUsers[areaOrNull]) {
          areaUsers[areaOrNull]++
        } else {
          areaUsers[areaOrNull] = 1
        }
      })
      return areaUsers
    },
    {} as Record<TaskResourceArea | 'UNSPECIFIED', number>,
  )

  return (
    <Spacing top="medium">
      <ThirdLevelHeadline>Checked in users/area</ThirdLevelHeadline>
      <Table style={{ fontSize: 'small', maxWidth: 'max-content' }}>
        <TableHeader style={{ fontSize: 'large' }}>
          <TableHeaderColumn>Area</TableHeaderColumn>
          <TableHeaderColumn>Tasks</TableHeaderColumn>
          <TableHeaderColumn>Users</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {[...TaskResourceAreas, null].map((area) => (
            <TableRow key={area?.value ?? 'null'}>
              <TableColumn>
                <Flex gap="small">
                  <span>
                    {area?.value ? TaskResourceAreaIcon[area?.value] : '📬'}
                  </span>
                  <span>
                    {area?.value ? TaskResourceAreaName[area.value] : 'No area'}
                  </span>
                </Flex>
              </TableColumn>
              <TableColumn>
                <Flex justify="center">
                  {
                    tasks.filter((task) => task.area === (area?.value ?? null))
                      .length
                  }
                </Flex>
              </TableColumn>
              <TableColumn>
                <Flex justify="center">
                  {areaUsers[area?.value ?? 'UNSPECIFIED']}
                </Flex>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Spacing>
  )
}
