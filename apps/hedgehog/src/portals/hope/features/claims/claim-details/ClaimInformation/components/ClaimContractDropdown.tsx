import { DropdownProps, extractErrorMessage } from '@hedvig-ui'
import * as React from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ContractDropdown } from '@hope/features/contracts/ContractDropdown'
import toast from 'react-hot-toast'
import { useSetClaimContractMutation } from 'types/generated/graphql'

export const ClaimContractDropdown: React.FC<
  {
    claimId: string
  } & Omit<DropdownProps, 'children' | 'value'>
> = ({ claimId, ...rest }) => {
  const {
    member: { contracts, contractMarketInfo },
    contract,
  } = useClaim()
  const preferredCurrency = contractMarketInfo?.preferredCurrency
  const selectedContractId = contract?.id
  const [setClaimContract] = useSetClaimContractMutation()

  const handleSelectContract = (contractId: string) => {
    toast.promise(setClaimContract({ variables: { claimId, contractId } }), {
      loading: 'Setting contract...',
      success: 'Contract set',
      error: ({ message }) => extractErrorMessage(message),
    })
  }

  return (
    <ContractDropdown
      contracts={contracts}
      preferredCurrency={preferredCurrency}
      selectedContractId={selectedContractId}
      onSelectContract={(contractId) => handleSelectContract(contractId)}
      {...rest}
    />
  )
}
