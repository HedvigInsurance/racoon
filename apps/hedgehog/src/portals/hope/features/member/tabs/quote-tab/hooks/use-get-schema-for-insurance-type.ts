import { InsuranceType } from '@hope/features/config/constants'
import {
  QuoteSchemaForInsuranceTypeQueryHookResult,
  useQuoteSchemaForInsuranceTypeQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { JsonRecord } from '@hedvig-ui/JsonSchemaForm/json-schema-form'

type GetSchemaForInsuranceTypeReturnTuple = [
  JsonRecord,
  QuoteSchemaForInsuranceTypeQueryHookResult,
]

gql`
  query QuoteSchemaForInsuranceType($insuranceType: String!) {
    quoteSchemaForInsuranceType(insuranceType: $insuranceType)
  }
`

export const useSchemaForInsuranceType = (
  insuranceType: InsuranceType,
): GetSchemaForInsuranceTypeReturnTuple => {
  const queryResult = useQuoteSchemaForInsuranceTypeQuery({
    variables: {
      insuranceType,
    },
  })
  const schema = queryResult.data?.quoteSchemaForInsuranceType as object
  return [schema, queryResult]
}
