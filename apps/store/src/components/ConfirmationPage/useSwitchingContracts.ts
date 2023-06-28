import { ParseKeys } from 'i18next'
import { useEffect, useMemo } from 'react'
import {
  ContractExternalInsuranceCancellationStatus,
  SwitchingContractFragment,
} from '@/services/apollo/generated'
import { useShopSessionOutcomeQuery } from '@/services/apollo/generated'
import { tKey } from '@/utils/i18n'

export type BankSigneringContract = {
  id: string
  displayName: string
  company: string
  status: {
    type: 'PENDING' | 'COMPLETED'
    messageKey: ParseKeys<'checkout'>
  }
  approveByDate: string
}

type Params = { shopSessionId: string }

export const useSwitchingContracts = ({ shopSessionId }: Params) => {
  const { data, refetch } = useShopSessionOutcomeQuery({
    variables: { shopSessionId },
    pollInterval: 10000,
  })

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [refetch])

  return useMemo<Array<BankSigneringContract>>(() => {
    const contracts = data?.shopSession.outcome?.createdContracts ?? []
    const switchingContracts: Array<BankSigneringContract> = []

    contracts.forEach((contract) => {
      const bankSigneringContract = convertToBankSigneringContract(contract)
      if (bankSigneringContract) switchingContracts.push(bankSigneringContract)
    })

    return switchingContracts
  }, [data?.shopSession.outcome?.createdContracts])
}

export const convertToBankSigneringContract = (
  contract: SwitchingContractFragment,
): BankSigneringContract | undefined => {
  if (!contract.externalInsuranceCancellation) return
  if (!contract.externalInsuranceCancellation.bankSignering) return

  const product = contract.variant.displayName
  const insurer = contract.externalInsuranceCancellation.externalInsurer.displayName

  return {
    id: contract.id,
    displayName: `${product} · ${insurer}`,
    company: insurer,
    status: getStatus(contract.externalInsuranceCancellation.status),
    approveByDate: contract.externalInsuranceCancellation.bankSignering.approveByDate,
  }
}

const getStatus = (
  status: ContractExternalInsuranceCancellationStatus,
): BankSigneringContract['status'] => {
  switch (status) {
    case ContractExternalInsuranceCancellationStatus.NotInitiated:
    case ContractExternalInsuranceCancellationStatus.Initiated:
      return {
        type: 'PENDING',
        messageKey: tKey('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_PENDING'),
      }

    case ContractExternalInsuranceCancellationStatus.Completed:
      return {
        type: 'COMPLETED',
        messageKey: tKey('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_COMPLETED'),
      }
  }
}
