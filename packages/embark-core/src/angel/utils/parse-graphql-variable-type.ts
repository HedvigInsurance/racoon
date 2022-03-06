import { GraphQLVariableType, PassageElement } from '@/shared/types'

const VARIABLE_TYPE_MAP = Object.values(GraphQLVariableType)
export const parseGraphQLVariableType = (asType: string) => {
  if (VARIABLE_TYPE_MAP.includes(asType as GraphQLVariableType)) {
    return asType as GraphQLVariableType
  }

  throw new Error(`${PassageElement.GraphQLVariable}: invalid variable type ${asType}`)
}
