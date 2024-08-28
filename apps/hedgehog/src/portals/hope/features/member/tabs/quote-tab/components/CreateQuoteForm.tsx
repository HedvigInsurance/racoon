import {
  Button,
  Checkbox,
  convertEnumToTitle,
  Flex,
  JsonSchemaForm,
  Spinner,
  TextDatePicker,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { InsuranceType } from '@hope/features/config/constants'
import { useSchemaForInsuranceType } from '@hope/features/member/tabs/quote-tab/hooks/use-get-schema-for-insurance-type'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  MemberQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'types/generated/graphql'
import { Stars } from 'react-bootstrap-icons'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { useQuoteFieldSuggestions } from '@hope/features/member/tabs/quote-tab/hooks/use-quote-field-suggestions'
import { JsonSchemaFormData } from '@hedvig-ui/JsonSchemaForm/json-schema-form'

const SuggestWrapper = styled.div<{ active?: boolean }>`
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};

  > button {
    min-width: 10rem;
  }

  .suggest-info {
    margin-top: 0.25rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).alpha(0.8).hex()};
    font-size: 0.75rem;
    text-align: center;
    max-width: 10rem;

    transition: opacity 200ms ease-in-out;
    opacity: 0;
  }

  :hover {
    .suggest-info {
      opacity: 1;
    }
  }
`

export const CreateQuoteForm: React.FC<{
  memberId: string
  insuranceType: InsuranceType
  onSubmitted: () => void
  onCancel: () => void
}> = ({ memberId, insuranceType, onSubmitted, onCancel }) => {
  const { suggestions: suggestedValues } = useQuoteFieldSuggestions(memberId)
  const [suggestions, setSuggestions] = useState<null | JsonSchemaFormData>(
    null,
  )

  const [bypassUwgl, setBypassUwgl] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(null)

  const [schema, { loading }] = useSchemaForInsuranceType(insuranceType)
  const [createQuoteForMember] = useCreateQuoteForMemberBySchemaMutation()

  const createQuote = (formData: Record<string, unknown>) => {
    if (!startDate) {
      toast.error('Please select a start date!')
      return
    }

    toast.promise(
      createQuoteForMember({
        variables: {
          memberId,
          schemaData: {
            ...formData,
            id: schema.$id,
          },
          bypassUnderwritingGuidelines: bypassUwgl,
          startDate: startDate,
        },
        refetchQueries: [
          {
            query: MemberQuotesDocument,
            variables: { memberId },
          },
        ],
      }),
      {
        loading: 'Saving quote',
        success: () => {
          onSubmitted()
          return 'Quote saved'
        },
        error: 'Could not save quote',
      },
    )
  }

  if (loading) {
    return (
      <Flex justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <>
      <Flex
        fullWidth
        justify="space-between"
        align="center"
        style={{ marginBottom: '0.5rem' }}
      >
        <ThirdLevelHeadline>
          Create {convertEnumToTitle(insuranceType)} quote
        </ThirdLevelHeadline>
        <SuggestWrapper active={Object.keys(suggestedValues).length !== 0}>
          <Button
            variant="secondary"
            onClick={() => setSuggestions(suggestedValues)}
            icon={
              <Stars
                width="1rem"
                height="1rem"
                style={{ marginRight: '0.5rem' }}
              />
            }
          >
            Suggest values
          </Button>
          <div className="suggest-info">Based on signed quotes</div>
        </SuggestWrapper>
      </Flex>
      <TextDatePicker
        style={{ width: '50%', paddingRight: '0.5em', paddingBottom: '1.0em' }}
        value={startDate}
        onChange={(date) => {
          setStartDate(date)
        }}
        label="Start date"
      />
      <JsonSchemaForm
        schema={schema}
        onSubmit={createQuote}
        onCancel={onCancel}
        submitText="Create"
        suggestions={suggestions ?? undefined}
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
