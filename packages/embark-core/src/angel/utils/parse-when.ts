import { WhenOperator, WhenStatement } from '@/shared/types'

const parseGraterThan = (statement: string): WhenStatement => {
  const [key, value] = statement.split(WhenOperator.GREATER_THAN).map((s) => s.trim())
  return { key, value, operator: WhenOperator.GREATER_THAN }
}

const parseLessThan = (statement: string): WhenStatement => {
  const [key, value] = statement.split(WhenOperator.LESS_THAN).map((s) => s.trim())
  return { key, value, operator: WhenOperator.LESS_THAN }
}

export const parseWhen = (rawStatement: string): Array<WhenStatement> => {
  return rawStatement
    .split('||')
    .map((s) => s.trim())
    .map<WhenStatement>((statement) => {
      if (statement.includes(WhenOperator.GREATER_THAN)) {
        return parseGraterThan(statement)
      } else if (statement.includes(WhenOperator.LESS_THAN)) {
        return parseLessThan(statement)
      } else if (statement === 'true') {
        return { operator: WhenOperator.PASS }
      } else {
        throw new Error(`Unknown When statement, got: ${statement}`)
      }
    })
}
