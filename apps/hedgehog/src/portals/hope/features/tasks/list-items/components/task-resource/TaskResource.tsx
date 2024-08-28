import { Task } from 'types/generated/graphql'
import { convertEnumToTitle } from '@hedvig-ui'
import { Tooltip } from '@hedvig-ui/redesign'
import clsx from 'clsx'
import { css } from './TaskResource.css'
import { TaskResourceAreaIcon } from '@hope/features/tasks/constants'

type Props = Pick<Task, 'resourceType' | 'area' | 'areaAssignment'>

export function TaskResource({ task }: { task: Props }) {
  const item = (
    <div className={clsx(css.Container, css.ResourceType[task.resourceType])}>
      {task.area && <div>{TaskResourceAreaIcon[task.area]}</div>}
      {convertEnumToTitle(task.resourceType)}
    </div>
  )

  if (!task.areaAssignment) {
    return item
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span>{item}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <div>
          <span>{convertEnumToTitle(task.areaAssignment.area)}</span>
          {task.areaAssignment.assignedByUser &&
            'name' in task.areaAssignment.assignedByUser && (
              <span> set by {task.areaAssignment.assignedByUser.name}</span>
            )}
          {!!task.areaAssignment.note && (
            <p>Note: {task.areaAssignment.note}</p>
          )}
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
