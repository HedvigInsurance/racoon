import { convertEmailToName, convertEmailToSignature } from '@hedvig-ui'
import { Tooltip } from '@hedvig-ui/redesign'
import clsx from 'clsx'
import { Task } from 'types/generated/graphql'
import { css } from './UserCircle.css'

export function UserCirle({
  task,
  assignedToMe,
}: {
  task: Task
  assignedToMe: boolean
}) {
  function getVariant() {
    if (task.assignableTo) {
      if (assignedToMe) {
        return 'darkWarning'
      }
      return 'warning'
    }
    if (assignedToMe) {
      return 'darkNeutral'
    }
    if (!task.assignedTo) {
      return 'danger'
    }
    return 'neutral'
  }
  const variant = getVariant()

  function getText() {
    if (task.assignedTo) {
      return {
        circle: convertEmailToSignature(task.assignedTo),
        tooltip: `${task.assignedTo}\n${task.assignReason}`,
      }
    }
    if (task.assignableTo) {
      return {
        circle: convertEmailToSignature(task.assignableTo),
        tooltip: `Assignable to ${convertEmailToName(task.assignableTo)}`,
      }
    }
    return { circle: '', tooltip: 'Unassigned' }
  }
  const text = getText()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span>
          <div className={clsx(css.UserCircle.base, css.UserCircle[variant])}>
            {text.circle}
          </div>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>{text.tooltip}</Tooltip.Content>
    </Tooltip.Root>
  )
}
