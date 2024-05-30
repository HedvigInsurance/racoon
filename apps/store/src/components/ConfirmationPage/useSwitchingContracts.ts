import type { ParseKeys } from 'i18next'
import { useEffect, useMemo } from 'react'
import type { SwitchingContractFragment } from '@/services/graphql/generated'
import { ContractExternalInsuranceCancellationStatus } from '@/services/graphql/generated'
import { useShopSessionOutcomeQuery } from '@/services/graphql/generated'
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
  url?: string
}

type Params = { shopSessionOutcomeId: string }

export const useSwitchingContracts = ({ shopSessionOutcomeId }: Params) => {
  const { data, refetch } = useShopSessionOutcomeQuery({
    variables: { shopSessionOutcomeId },
    pollInterval: 10000,
  })

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [refetch])

  return useMemo<Array<BankSigneringContract>>(() => {
    const contracts = data?.shopSessionOutcome?.createdContracts ?? []
    const switchingContracts: Array<BankSigneringContract> = []

    contracts.forEach((contract) => {
      const bankSigneringContract = convertToBankSigneringContract(contract)
      if (bankSigneringContract) switchingContracts.push(bankSigneringContract)
    })

    return switchingContracts
  }, [data?.shopSessionOutcome?.createdContracts])
}

export const convertToBankSigneringContract = (
  contract: SwitchingContractFragment,
): BankSigneringContract | undefined => {
  if (!contract.externalInsuranceCancellation) return
  if (!contract.externalInsuranceCancellation.bankSignering) return

  const productVariant = contract.currentAgreement.productVariant
  const product = productVariant.displayNameSubtype || productVariant.displayName
  const insurer = contract.externalInsuranceCancellation.externalInsurer.displayName

  return {
    id: contract.id,
    displayName: `${product} · ${insurer}`,
    company: insurer,
    status: getStatus(contract.externalInsuranceCancellation.status),
    approveByDate: contract.externalInsuranceCancellation.bankSignering.approveByDate,
    url: contract.externalInsuranceCancellation.bankSignering.url ?? undefined,
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
        messageKey: tKey<'checkout'>('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_PENDING'),
      }

    case ContractExternalInsuranceCancellationStatus.Completed:
      return {
        type: 'COMPLETED',
        messageKey: tKey<'checkout'>('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_COMPLETED'),
      }
  }
}
