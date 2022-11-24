import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntentDataUpdateMutation } from '@/services/apollo/generated'
import { SelectOptions } from './CurrentInsuranceField.types'

const useCompanyOptions = (productName: string): SelectOptions => {
  console.debug('Fetching companies for: ', productName)
  const companyOptions = [
    {
      name: 'Trygg Hansa',
      value: 'TRYGGHANSA',
    },
    {
      name: 'Folksam',
      value: 'FOLKSAM',
    },
    {
      name: 'If',
      value: 'IF',
    },
    {
      name: 'Länsförsäkringar',
      value: 'LANSFORSAKRINGAR',
    },
    {
      name: 'Länsförsäkringar Stockholm',
      value: 'LANSFORSAKRINGAR',
    },
    {
      name: 'Moderna',
      value: 'MODERNA',
    },
  ]
  return companyOptions
}

const useUpdateExternalInsurer = (priceIntentId: string) => {
  const [updateExternalInsurer] = usePriceIntentDataUpdateMutation({
    onCompleted(data) {
      if (data.priceIntentDataUpdate.priceIntent) {
        console.log('Added external insurer')
      } else {
        datadogLogs.logger.warn('Failed to add external insurer', {
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

  return (externalInsurerId: string) => {
    updateExternalInsurer({ variables: { priceIntentId, data: { externalInsurerId } } })
  }
}

type Params = {
  productName: string
  priceIntentId: string
}

export const useCurrentInsuranceFieldProps = ({ productName, priceIntentId }: Params) => {
  const companyOptions = useCompanyOptions(productName)
  const updateExternalInsurer = useUpdateExternalInsurer(priceIntentId)

  return {
    companyOptions,
    updateExternalInsurer,
  }
}
