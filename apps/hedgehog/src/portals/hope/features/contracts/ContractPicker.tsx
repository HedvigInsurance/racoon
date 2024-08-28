import { DropdownOption } from '@hedvig-ui'
import { ContractFragment } from 'types/generated/graphql'
import { ContractItem } from './ContractItem'
import { ContractStatus } from '../config/constants'

export const ContractPicker = ({
  contracts,
  preferredCurrency,
  selectedContractId,
  onSelectContract,
}: {
  contracts: ContractFragment[]
  preferredCurrency?: string
  selectedContractId?: string
  onSelectContract: (contractId: string) => void
}) => {
  const selectedContract = contracts.find(({ id }) => id === selectedContractId)
  const relevantContracts = contracts.filter(
    (contract) =>
      contract.status !== ContractStatus.Deleted ||
      selectedContract?.status === ContractStatus.Deleted,
  )
  return (
    <>
      {relevantContracts.map((contract) => {
        return (
          <DropdownOption
            key={contract.id}
            onClick={() => onSelectContract(contract.id)}
            selected={contract.id === selectedContractId}
          >
            <ContractItem
              contract={contract}
              preferredCurrency={preferredCurrency}
            />
          </DropdownOption>
        )
      })}
    </>
  )
}
