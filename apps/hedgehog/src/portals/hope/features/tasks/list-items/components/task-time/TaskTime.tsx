import { Task } from 'types/generated/graphql'
import { isAfter } from 'date-fns'
import clsx from 'clsx'
import { css } from './TaskTime.css'
import { Tooltip } from '@hedvig-ui/redesign'
import { formatDistanceTo } from '@hedvig-ui/utils/date'

export function TaskTime({ task }: { task: Task }) {
  const hasAssignableFrom = !!task.assignableFrom
  const isFuture =
    task.assignableFrom && isAfter(task.assignableFrom, new Date())
  const assigned = !!task.assignedTo

  function getVariant() {
    if (!hasAssignableFrom) {
      return 'neutral'
    }
    if (isFuture) {
      return 'success'
    }
    if (assigned) {
      return 'warning'
    }
    return 'danger'
  }

  const variant = getVariant()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className={clsx(css.TaskTime.base, css.TaskTime[variant])}>
          {formatDistanceTo(task.assignableFrom ?? task.createdAt, {
            compact: true,
          })}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {formatDistanceTo(task.assignableFrom ?? task.createdAt, {
          addSuffix: true,
        })}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
