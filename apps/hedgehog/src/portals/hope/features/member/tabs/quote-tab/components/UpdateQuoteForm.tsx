import { Checkbox, JsonSchemaForm, Label, TextDatePicker } from '@hedvig-ui'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GenericAgreement,
  MemberQuotesDocument,
  Quote,
  useUpdateQuoteBySchemaMutation,
} from 'types/generated/graphql'
import { getOriginatingAgreementPeriod } from '@hope/features/contracts/utils'

export const UpdateQuoteForm: React.FC<{
  quote: Quote
  contract: Contract
  agreement: GenericAgreement
  onSubmitted: () => void
  onCancel: () => void
}> = ({ quote, contract, agreement, onSubmitted, onCancel }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)
  const [startDate, setStartDate] = useState(quote.startDate)
  const [minDate, maxDate] = getOriginatingAgreementPeriod(agreement, contract)
  const [updateQuote] = useUpdateQuoteBySchemaMutation()

  const performQuoteUpdate = (formData: Record<string, unknown>) => {
    if ('coInsured' in formData && 'numberCoInsured' in formData) {
      if (
        (formData.numberCoInsured as number) <
        (formData.coInsured as unknown[]).length
      ) {
        toast.error(
          "Number Co-insured input can't be less than amount of co-insured people",
        )
        return
      }
    }

    const options = {
      variables: {
        quoteId: quote.id,
        schemaData: {
          ...formData,
          id: quote.schema.$id,
        },
        bypassUnderwritingGuidelines: bypassUwgl,
        startDate: startDate,
      },
      refetchQueries: [
        {
          query: MemberQuotesDocument,
          variables: { memberId: quote.memberId },
        },
      ],
    }
    updateQuote(options)
      .then(() => {
        onSubmitted()
        toast.success('Quote saved')
      })
      .catch(() => {
        toast.error('Could not save quote')
      })
  }

  return (
    <>
      <div>
        <Label>
          {agreement?.fromDate !== null ? (
            <>
              Start date<span style={{ color: '#e24646' }}>*</span>
            </>
          ) : (
            'Start date (cannot be set on midterm changes for pending agreements, need to activate first)'
          )}
        </Label>
        <TextDatePicker
          style={{ width: '50%', paddingRight: '0.5em' }}
          value={startDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(date) => {
            setStartDate(date)
          }}
          disabled={agreement?.fromDate === null}
          hidden={agreement?.fromDate === null}
        />
      </div>
      <JsonSchemaForm
        schema={quote.schema}
        initialFormData={quote.schemaData}
        onSubmit={performQuoteUpdate}
        onCancel={onCancel}
        submitText="Save"
      >
        <Checkbox
          checked={bypassUwgl}
          onChange={({ currentTarget: { checked } }) =>
            setBypassUwgl(Boolean(checked))
          }
          label="Bypass underwriting guidelines"
        />
      </JsonSchemaForm>
    </>
  )
}
