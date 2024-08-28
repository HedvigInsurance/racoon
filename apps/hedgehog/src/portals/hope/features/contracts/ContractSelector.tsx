import * as React from 'react'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import {
  ContractIcon,
  InsuranceType,
} from 'portals/hope/features/config/constants'
import { convertEnumToTitle, dateTimeFormatter } from '@hedvig-ui'
import { PopupMenuItem } from '@hedvig-ui/redesign'

const baseAppUrl = process.env.NEXT_PUBLIC_HEDVIG_APP

export const ContractSelector: React.FC<{
  memberId: string
  onSelect: (link: string) => void
}> = ({ memberId, onSelect }) => {
  const [contracts, { loading }] = useContracts(memberId)

  if (contracts.length === 0) return null

  if (loading) return null

  return (
    <div>
      {contracts
        .filter(
          (contract) =>
            !contract?.terminationDate ||
            new Date(contract.terminationDate) > new Date(),
        )
        .map((contract) => {
          const url = `${baseAppUrl}/contract?contractId=${contract.id}`
          const contractCreationDate = dateTimeFormatter(
            contract.createdAt,
            'yyyy-MM-dd',
          )
          const contractTerm =
            contracts.filter(
              (otherContract) =>
                otherContract.insuranceType === contract.insuranceType,
            ).length > 1 && contractCreationDate
              ? ` (Created: ${contractCreationDate})`
              : ''
          const contractTitle = `${convertEnumToTitle(contract.insuranceType)}${contractTerm}`
          return (
            <PopupMenuItem
              key={contract.id}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(url)
              }}
            >
              {contractTitle}
              <span>
                {ContractIcon[contract.insuranceType as InsuranceType]}
              </span>
            </PopupMenuItem>
          )
        })}
    </div>
  )
}
