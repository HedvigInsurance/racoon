import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useCallback, useState } from 'react'
import { Dialog } from 'ui'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
  usePriceIntentInsurelyUpdateMutation,
} from '@/services/apollo/generated'
import { InsurelyIframe } from '@/services/Insurely/Insurely'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'
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
  const updateExternalInsurer = useUpdateExternalInsurer(priceIntentId)

  const [isInsurelyModalOpen, setIsInsurelyModalOpen] = useState(false)
  const handleCompanyChange = (company?: string) => {
    if (company) setIsInsurelyModalOpen(true)
    updateExternalInsurer(company)
  }

  const closeModal = useCallback(() => setIsInsurelyModalOpen(false), [])

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
      {isInsurelyModalOpen && (
        <Dialog.Root open onOpenChange={setIsInsurelyModalOpen}>
          <StyledDialogContent>
            <StyledDialogWindow>
              <InsurelyIframe
                clientId={insurelyClientId}
                // @TODO: convert from "company"
                company={'se-demo'}
                // @TODO: get from price intent
                personalNumber={'200001020000'}
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

const useUpdateExternalInsurer = (priceIntentId: string) => {
  const [updateExternalInsurer] = useExternalInsurerUpdateMutation({
    onCompleted(data) {
      const updatedPriceIntent = data.priceIntentExternalInsurerUpdate.priceIntent
      if (updatedPriceIntent) {
        const insurer = updatedPriceIntent.externalInsurer?.displayName
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
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingTop: theme.space[2],
  paddingLeft: theme.space[2],
  paddingRight: theme.space[2],
}))

const StyledDialogWindow = styled(Dialog.Window)(({ theme }) => ({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
  height: '100%',
  maxHeight: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderTopLeftRadius: theme.radius.xs,
  borderTopRightRadius: theme.radius.xs,
}))
