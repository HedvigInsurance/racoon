import { LogicalOperator } from '@/shared/types'

export const parseLogicalOperator = (rawStatement: string): LogicalOperator => {
  if (rawStatement.includes(LogicalOperator.AND)) return LogicalOperator.AND
  if (rawStatement.includes(LogicalOperator.OR)) return LogicalOperator.OR
  return LogicalOperator.AND
}
