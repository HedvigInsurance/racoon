import {
  convertCamelcaseToTitle,
  convertEnumOrSentenceToTitle,
} from '@hedvig-ui'
import * as React from 'react'
import { Quote } from 'types/generated/graphql'
import { Label } from '@hedvig-ui'
import {
  JsonRecord,
  JsonSchemaFormData,
} from '@hedvig-ui/JsonSchemaForm/json-schema-form'

export const isSignedOrExpired = (quote: Quote) =>
  isExpired(quote) || isSigned(quote)

export const isExpired = (quote: Quote) => {
  const createdAt = new Date(quote.createdAt)
  const now = new Date()

  const thirtyDaysInSeconds = 30 * 24 * 3600
  const validityInSeconds = quote.validity ?? thirtyDaysInSeconds
  const validUntil = new Date(createdAt.getTime() + validityInSeconds * 1000)

  return now > validUntil
}

export const isSigned = (quote: Quote) => quote.state === 'SIGNED'

export const SchemaDataSummary: React.FC<{
  schemaData: JsonSchemaFormData
}> = ({ schemaData }) => {
  return (
    <>
      {Object.entries(schemaData)
        .filter(([key, value]) => key !== 'id' && value !== null)
        .map(([key, value]) => {
          const valueMessage = valueToMessage(
            key == 'breeds' && Array.isArray(value) ? value.join(', ') : value,
          )
          return (
            <React.Fragment key={key}>
              <div className={key}>
                <Label>{convertCamelcaseToTitle(key)}</Label>{' '}
                <div>
                  {valueMessage && convertEnumOrSentenceToTitle(valueMessage)}
                </div>
              </div>
            </React.Fragment>
          )
        })}
    </>
  )
}

const valueToMessage = (
  value: JsonRecord | boolean | string,
): string | null => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'number':
    case 'string':
      return value.toString()
    case 'object':
      if (Array.isArray(value)) {
        return value.length.toString()
      }
      return null
    default:
      return null
  }
}
