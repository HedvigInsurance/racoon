import clsx from 'clsx'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { ComponentProps } from 'react'

export function TaskTitle({
  taskTitle,
  className,
  ...props
}: ComponentProps<'p'> & { taskTitle: string | null | undefined }) {
  if (!taskTitle) {
    return (
      <p
        className={clsx(className, cssUtil.textMuted)}
        style={{ whiteSpace: 'nowrap', width: '12rem' }}
        {...props}
      >
        Not available
      </p>
    )
  }
  return (
    <p
      className={clsx(className, cssUtil.textLink)}
      style={{
        whiteSpace: 'nowrap',
        width: '12rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      {...props}
    >
      {taskTitle}
    </p>
  )
}
