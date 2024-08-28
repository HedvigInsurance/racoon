import { useState } from 'react'
import { Modal, extractErrorMessage } from '@hedvig-ui'
import {
  Flex,
  Grid,
  InfoTag,
  LabeledText,
  NonInteractableDropdown,
} from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useSetClaimContractMutation } from 'types/generated/graphql'
import * as css from './contractpicker.css'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { Exposure } from '../Exposure'
import { getContractOptionsOnDate } from './helpers'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

gql`
  mutation SetClaimContract($claimId: ID!, $contractId: ID!) {
    claim_setContract(claimId: $claimId, contractId: $contractId) {
      ...ClaimDetails
    }
  }
`

export const ContractPicker = () => {
  const [setClaimContract] = useSetClaimContractMutation()
  const { claimId, contract, member, dateOfOccurrence } = useClaim()

  const contracts = member?.contracts ?? []
  const selectedContractId = contract?.id
  const contractOptions = getContractOptionsOnDate(contracts, dateOfOccurrence)

  const [showPicker, setShowPicker] = useState(false)

  const handleSelectContract = (contractId: string) => {
    toast.promise(setClaimContract({ variables: { claimId, contractId } }), {
      loading: 'Setting contract...',
      success: () => {
        setShowPicker(false)
        return 'Contract set'
      },
      error: ({ message }) => extractErrorMessage(message),
    })
  }

  return (
    <>
      <NonInteractableDropdown
        onClick={() => setShowPicker(true)}
        label="Contract"
        options={contractOptions.map((option) => ({
          label: option.name,
          value: option.contractId,
          selected: option.contractId === selectedContractId,
          action: () => 0,
        }))}
      />

      <Modal
        visible={showPicker && contractOptions.length > 0}
        onClose={() => setShowPicker(false)}
      >
        <div className={css.picker}>
          {contractOptions.map((option) => (
            <div
              key={option.contractId}
              className={css.pickerOption}
              onClick={() => {
                handleSelectContract(option.contractId)
              }}
            >
              <Flex mb="xxs" justify="space-between">
                <span className={css.optionTitle}>{option.name}</span>
                {option.contractId === selectedContractId && (
                  <span className={cssUtil.textMuted}>Selected</span>
                )}
              </Flex>

              <Grid equalColumns={2} columnGap="xs">
                <Exposure
                  petName={option.petName}
                  registrationNumber={option.registrationNumber}
                  street={option.street}
                />

                <BirthDate date={option.birthDate} />
              </Grid>

              <DateRange from={option.fromDate} to={option.toDate} />

              <Flex mt="sm" gap="xxs" wrap="wrap">
                {option.tags.map((tag) => (
                  <InfoTag key={tag.text} variant={tag.variant}>
                    {tag.text}
                  </InfoTag>
                ))}
              </Flex>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

const BirthDate = ({ date }: { date?: string }) => {
  if (!date) {
    return null
  }
  return <LabeledText label="Birth date">{date}</LabeledText>
}

const DateRange = ({ from, to }: { from: string; to?: string }) => {
  return (
    <Grid equalColumns={2} columnGap="xs">
      <LabeledText label="Valid from">{from}</LabeledText>
      {!!to && <LabeledText label="Active to">{to}</LabeledText>}
    </Grid>
  )
}
