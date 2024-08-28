import { Dropdown, DropdownOption, DropdownProps } from '@hedvig-ui'
import { ContractPicker } from './ContractPicker'
import { ContractItem } from './ContractItem'

export const ContractDropdown = ({
  contracts,
  preferredCurrency,
  selectedContractId,
  onSelectContract,
  ...rest
}: Parameters<typeof ContractPicker>[number] &
  Omit<DropdownProps, 'children' | 'value'>) => {
  return (
    <Dropdown placeholder="None selected" {...rest}>
      {contracts.map((contract) => {
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
    </Dropdown>
  )
}
