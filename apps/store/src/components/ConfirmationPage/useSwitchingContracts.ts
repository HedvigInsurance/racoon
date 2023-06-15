import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo } from 'react'
import { ContractExternalInsuranceCancellationStatus } from '@/services/apollo/generated'
import { useShopSessionOutcomeQuery } from '@/services/apollo/generated'

export type BankSigneringContract = {
  id: string
  displayName: string
  status: {
    type: 'PENDING' | 'COMPLETED'
    message: string
  }
  approveByDate: string
}

type Params = { shopSessionId: string }

export const useSwitchingContracts = ({ shopSessionId }: Params) => {
  const { data, refetch } = useShopSessionOutcomeQuery({
    variables: { shopSessionId },
    pollInterval: 10000,
  })
  const getStatus = useGetStatus()

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [refetch])

  return useMemo<Array<BankSigneringContract>>(() => {
    const contracts = data?.shopSession.outcome?.createdContracts ?? []
    const switchingContracts: Array<BankSigneringContract> = []

    contracts.forEach((contract) => {
      const cancellation = contract.externalInsuranceCancellation
      if (!cancellation) return

      if (!cancellation.bankSignering) return

      switchingContracts.push({
        id: contract.id,
        displayName: [contract.variant.displayName, cancellation.externalInsurer.displayName].join(
          ' · ',
        ),
        status: getStatus(cancellation.status),
        approveByDate: cancellation.bankSignering.approveByDate,
      })
    })

    return switchingContracts
  }, [data?.shopSession.outcome?.createdContracts, getStatus])
}

const useGetStatus = () => {
  const { t } = useTranslation('checkout')

  return useCallback(
    (status: ContractExternalInsuranceCancellationStatus): BankSigneringContract['status'] => {
      switch (status) {
        case ContractExternalInsuranceCancellationStatus.NotInitiated:
        case ContractExternalInsuranceCancellationStatus.Initiated:
          return {
            type: 'PENDING',
            message: t(`SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_PENDING`),
          }

        case ContractExternalInsuranceCancellationStatus.Completed:
          return {
            type: 'COMPLETED',
            message: t(`SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_COMPLETED`),
          }
      }
    },
    [t],
  )
}
