import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntent } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
} from '@/services/graphql/generated'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useShowFetchInsurance } from '../useFetchInsurance'
import { InputCurrentInsurance } from './InputCurrentInsurance'

type Props = {
  label: string
}

export const CurrentInsuranceField = ({ label }: Props) => {
  const priceIntent = usePriceIntent()
  const priceIntentId = priceIntent.id

  const showFetchInsurance = useShowFetchInsurance({ priceIntentId })
  const companyOptions = useCompanyOptions(priceIntent.product.name)
  const externalInsurer = priceIntent.externalInsurer?.id
  const updateExternalInsurer = useUpdateExternalInsurer({
    priceIntentId,
    onCompleted(updatedPriceIntent) {
      const externalInsurer = updatedPriceIntent.externalInsurer

      if (!externalInsurer) {
        datadogLogs.logger.warn('Failed to update external insurer', {
          priceIntentId,
        })
        return
      }

      showFetchInsurance({ force: true })
    },
  })

  return (
    <InputCurrentInsurance
      label={label}
      company={externalInsurer}
      companyOptions={companyOptions}
      onCompanyChange={updateExternalInsurer}
    />
  )
}

const useCompanyOptions = (productName: string) => {
  const { data } = useExternalInsurersQuery({ variables: { productName } })
  const companyOptions = data?.product?.externalInsurers.map((item) => ({
    name: item.displayName,
    value: item.id,
  }))
  return companyOptions ?? []
}

type UseUpdateExternalInsurerParams = {
  priceIntentId: string
  onCompleted: (priceIntent: PriceIntent) => void
}

const useUpdateExternalInsurer = (params: UseUpdateExternalInsurerParams) => {
  const { priceIntentId } = params
  const [updateExternalInsurer] = useExternalInsurerUpdateMutation({
    onCompleted(data) {
      const updatedPriceIntent = data.priceIntentExternalInsurerUpdate.priceIntent
      if (updatedPriceIntent) {
        const insurer = updatedPriceIntent.externalInsurer?.displayName
        datadogLogs.logger.info(`Updated external insurer: ${insurer}`)
        params.onCompleted(updatedPriceIntent)
      } else {
        datadogLogs.logger.warn('Failed to update external insurer', {
          priceIntentId,
        })
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Error adding external insurer', {
        priceIntentId,
        error,
      })
    },
  })

  return (externalInsurerId?: string) => {
    datadogLogs.logger.info('Updating external insurer', { priceIntentId, externalInsurerId })
    updateExternalInsurer({
      variables: { priceIntentId, externalInsurerId },
    })
  }
}
