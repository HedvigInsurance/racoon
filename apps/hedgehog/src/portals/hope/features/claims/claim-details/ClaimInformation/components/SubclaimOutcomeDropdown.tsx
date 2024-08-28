import {
  convertEnumToTitle,
  extractErrorMessage,
  SearchableDropdown,
} from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useSetSubclaimOutcomeMutation } from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

export enum ClaimOutcomes {
  PAID_OUT = 'PAID_OUT',
  NOT_COVERED_BY_TERMS = 'NOT_COVERED_BY_TERMS',
  COMPENSATION_BELOW_DEDUCTIBLE = 'COMPENSATION_BELOW_DEDUCTIBLE',
  RETRACTED_BY_MEMBER = 'RETRACTED_BY_MEMBER',
  RETRACTED_BY_HEDVIG = 'RETRACTED_BY_HEDVIG',
  COVERED_BY_OTHER_INSURANCE_COMPANY = 'COVERED_BY_OTHER_INSURANCE_COMPANY',
  UNRESPONSIVE = 'UNRESPONSIVE',
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  DUPLICATE = 'DUPLICATE',
  OTHER = 'OTHER',
  TEST = 'TEST',
}

gql`
  mutation SetSubclaimOutcome($subclaimId: ID!, $outcome: String) {
    subclaim_setOutcome(subclaimId: $subclaimId, outcome: $outcome) {
      id
      outcome
    }
  }
`

const useSetSubclaimOutcome = () => {
  const [setClaimOutcome] = useSetSubclaimOutcomeMutation()

  const setOutcome = (subclaimId: string, newOutcome: string | null) => {
    PushUserAction('claim', 'set', 'outcome', newOutcome)

    return toast.promise(
      setClaimOutcome({
        variables: { subclaimId: subclaimId, outcome: newOutcome },
        optimisticResponse: {
          subclaim_setOutcome: {
            __typename: 'Subclaim',
            id: subclaimId,
            outcome: newOutcome,
          },
        },
      }),
      {
        loading: 'Loading...',
        success: 'Outcome updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    setOutcome,
  }
}

export const SubclaimOutcomeDropdown: React.FC<{
  subclaimId: string
}> = ({ subclaimId }) => {
  const { getSubclaim } = useClaim()
  const outcome = getSubclaim(subclaimId)?.outcome
  const { setOutcome } = useSetSubclaimOutcome()

  const options = [
    ...Object.keys(ClaimOutcomes).map((value) => ({
      value,
      text: convertEnumToTitle(value),
    })),
    { value: '', text: 'Not specified' },
  ]

  return (
    <SearchableDropdown
      value={outcome}
      placeholder="Set outcome"
      isClearable={false}
      onChange={async (selection) => {
        if (!selection) return
        const newValue = selection.value.toString()
        await setOutcome(subclaimId, newValue ? newValue : null)
      }}
      noOptionsMessage={() => 'No results'}
      options={options.map((option) => ({
        value: option.value,
        label: option.text,
        searchTerms: option.text,
      }))}
      inputId="subclaim-outcome-dropdown"
    />
  )
}
