import { ComponentProps } from 'react'
import { TableRowStatus } from './TableRowStatus'
import { LegacyTooltip } from '@hedvig-ui/redesign'

interface Props extends ComponentProps<'span'> {
  status: ComponentProps<typeof TableRowStatus>['status']
  popoverContent: string
}
export const TableRowStatusWithPopover = ({
  status,
  popoverContent,
  ...props
}: Props) => {
  return (
    <TableRowStatus status={status} {...props} as={'span'}>
      <LegacyTooltip content={popoverContent}>
        <div style={{ height: '63px' }} />
      </LegacyTooltip>
    </TableRowStatus>
  )
}
