import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useCallback, useState } from 'react'
import { Dialog } from 'ui'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
  usePriceIntentInsurelyUpdateMutation,
} from '@/services/apollo/generated'
import { InsurelyIframe, insurelyPrefillInput } from '@/services/Insurely/Insurely'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'
import { PERSONAL_NUMBER_FIELD_NAME } from '@/services/priceIntent/priceIntent.constants'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { InputCurrentInsurance } from './InputCurrentInsurance'

type Props = {
  label: string
  productName: string
  priceIntentId: string
  insurelyClientId: string
  externalInsurer?: string
}

export const CurrentInsuranceField = (props: Props) => {
  const { label, productName, priceIntentId, insurelyClientId, externalInsurer } = props
  const companyOptions = useCompanyOptions(productName)
  const updateExternalInsurer = useUpdateExternalInsurer({
    priceIntentId,
    onCompleted(updatedPriceIntent) {
      const companyId = updatedPriceIntent.externalInsurer?.insurelyId
      const personalNumber = updatedPriceIntent.data[PERSONAL_NUMBER_FIELD_NAME]
      if (companyId && typeof personalNumber === 'string') {
        setIsDialogOpen(true)
        insurelyPrefillInput({ company: companyId, personalNumber })
      } else {
        datadogLogs.logger.error('Failed to prefill Insurely', {
          priceIntentId,
          companyId,
          personalNumber,
        })
      }
    },
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleCompanyChange = (company?: string) => {
    updateExternalInsurer(company)
  }

  const closeModal = useCallback(() => setIsDialogOpen(false), [])

  const [dataCollectionId, setDataCollectionId] = useState<string | null>(null)
  const [updateDataCollectionId] = usePriceIntentInsurelyUpdateMutation({
    onError(error) {
      console.warn(error)
    },
  })

  const handleInsurelyCompleted = useCallback(() => {
    if (dataCollectionId) {
      updateDataCollectionId({ variables: { priceIntentId, dataCollectionId } })
    } else {
      datadogLogs.logger.error('Completed Insurely without getting data collection ID', {
        priceIntentId,
      })
    }
    closeModal()
  }, [updateDataCollectionId, priceIntentId, dataCollectionId, closeModal])

  return (
    <>
      <InputCurrentInsurance
        label={label}
        company={externalInsurer}
        companyOptions={companyOptions}
        onCompanyChange={handleCompanyChange}
      />
      {isDialogOpen && (
        <Dialog.Root open onOpenChange={closeModal}>
          <StyledDialogContent>
            <StyledDialogWindow>
              <InsurelyIframe
                clientId={insurelyClientId}
                onCollection={setDataCollectionId}
                onClose={closeModal}
                onCompleted={handleInsurelyCompleted}
              />
            </StyledDialogWindow>
          </StyledDialogContent>
        </Dialog.Root>
      )}
    </>
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

const StyledDialogContent = styled(Dialog.Content)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space[2],
}))

const StyledDialogWindow = styled(Dialog.Window)(({ theme }) => ({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
  height: '100%',
  maxHeight: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderRadius: theme.radius.xs,
}))
