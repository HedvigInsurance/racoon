import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo } from 'react'
import { ContractExternalInsuranceCancellationStatus } from '@/services/apollo/generated'
import { useShopSessionOutcomeQuery } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'

export type BankSigneringContract = {
  id: string
  displayName: string
  status: {
    type: 'PENDING' | 'COMPLETED'
    message: string
  }
  company: string
  approveByDate: Date
}

type Params = { shopSessionId: string }

export const useSwitchingContracts = ({ shopSessionId }: Params) => {
  const { data, refetch } = useShopSessionOutcomeQuery({
    variables: { id: shopSessionId },
    pollInterval: 10000,
  })
  const getStatus = useGetStatus()

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [refetch])

  return useMemo(() => {
    const contracts = data?.shopSession?.outcome?.createdContracts ?? []
    const switchingContracts: Array<BankSigneringContract> = []

    contracts.forEach((contract) => {
      const cancellation = contract.externalInsuranceCancellation
      if (!cancellation) return

      if (!cancellation.bankSignering) return

      const approveByDate = convertToDate(cancellation.bankSignering.approveByDate)
      if (!approveByDate) {
        datadogLogs.logger.error('Could not parse approveByDate', {
          contractId: contract.id,
          approveByDate: cancellation.bankSignering.approveByDate,
        })
        return
      }

      switchingContracts.push({
        id: contract.id,
        displayName: contract.variant.displayName,
        status: getStatus(cancellation.status),
        company: cancellation.externalInsurer.displayName,
        approveByDate,
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
