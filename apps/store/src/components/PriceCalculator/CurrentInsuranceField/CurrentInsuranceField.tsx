import { datadogLogs } from '@datadog/browser-logs'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
} from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { InputCurrentInsurance } from './InputCurrentInsurance'

type Props = {
  label: string
  productName: string
  priceIntentId: string
  externalInsurer?: string
}

export const CurrentInsuranceField = (props: Props) => {
  const { label, productName, priceIntentId, externalInsurer } = props
  const companyOptions = useCompanyOptions(productName)
  const handleCompanyChange = useUpdateExternalInsurer(priceIntentId)

  return (
    <InputCurrentInsurance
      label={label}
      company={externalInsurer}
      companyOptions={companyOptions}
      onCompanyChange={handleCompanyChange}
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

const useUpdateExternalInsurer = (priceIntentId: string) => {
  const [updateExternalInsurer] = useExternalInsurerUpdateMutation({
    onCompleted(data) {
      const updatedPriceIntent = data.priceIntentExternalInsurerUpdate.priceIntent
      if (updatedPriceIntent) {
        const insurer = updatedPriceIntent.cancellation.externalInsurer?.displayName
        datadogLogs.logger.info(`Updated external insurer: ${insurer}`)
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

  const { locale } = useCurrentLocale()

  return (externalInsurerId: string) => {
    datadogLogs.logger.info('Updating external insurer', { priceIntentId, externalInsurerId })
    updateExternalInsurer({
      variables: { priceIntentId, externalInsurer: externalInsurerId, locale },
    })
  }
}
