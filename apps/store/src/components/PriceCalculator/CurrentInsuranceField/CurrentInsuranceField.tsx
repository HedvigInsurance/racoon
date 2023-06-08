import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useCallback, useState } from 'react'
import { Button, Dialog, Heading, Space, theme } from 'ui'
import { PURCHASE_FORM_MAX_WIDTH } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
  usePriceIntentInsurelyUpdateMutation,
  ExternalInsurer,
  useInsurelyDataCollectionCreateMutation,
} from '@/services/apollo/generated'
import { InsurelyIframe, setInsurelyConfig } from '@/services/Insurely/Insurely'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Features } from '@/utils/Features'
import { InputCurrentInsurance } from './InputCurrentInsurance'

const INSURELY_IS_ENABLED = Features.enabled('INSURELY')

type Props = {
  label: string
  productName: string
  priceIntentId: string
  insurelyConfigName?: string
  externalInsurer?: string
}

type State =
  | { type: 'IDLE' }
  | { type: 'COMPARE'; externalInsurer: ExternalInsurer; insurelyConfigName: string }
  | { type: 'SUCCESS'; externalInsurer: ExternalInsurer }
  | { type: 'CONFIRMED'; externalInsurer: ExternalInsurer }

export const CurrentInsuranceField = (props: Props) => {
  const priceIntentId = props.priceIntentId
  const { t } = useTranslation('purchase-form')
  const { shopSession } = useShopSession()
  const [state, setState] = useState<State>({ type: 'IDLE' })

  const compare = useCallback(
    (externalInsurer: ExternalInsurer, insurelyConfigName: string) =>
      setState({ type: 'COMPARE', externalInsurer, insurelyConfigName }),
    [],
  )
  const close = useCallback(() => setState({ type: 'IDLE' }), [])
  const success = useCallback(
    (externalInsurer: ExternalInsurer) => setState({ type: 'SUCCESS', externalInsurer }),
    [],
  )
  const confirm = useCallback(
    (externalInsurer: ExternalInsurer) => setState({ type: 'CONFIRMED', externalInsurer }),
    [],
  )
  const isDialogOpen = INSURELY_IS_ENABLED && (state.type === 'COMPARE' || state.type === 'SUCCESS')

  const companyOptions = useCompanyOptions(props.productName)
  const updateExternalInsurer = useUpdateExternalInsurer({
    priceIntentId,
    onCompleted(updatedPriceIntent) {
      const externalInsurer = updatedPriceIntent.externalInsurer
      const ssn = shopSession?.customer?.ssn

      if (!externalInsurer) {
        datadogLogs.logger.warn('Failed to update external insurer', {
          priceIntentId,
        })
        return
      }

      if (props.insurelyConfigName && ssn) {
        compare(externalInsurer, props.insurelyConfigName)
        setInsurelyConfig({
          company: externalInsurer.insurelyId ?? undefined,
          ssn,
        })
      } else {
        confirm(externalInsurer)
      }
    },
  })

  const handleCompanyChange = (company?: string) => {
    updateExternalInsurer(company)
  }

  const [dataCollectionId, setDataCollectionId] = useState<string | null>(null)
  const [updateDataCollectionId] = usePriceIntentInsurelyUpdateMutation({
    onCompleted({ priceIntentInsurelyUpdate }) {
      datadogLogs.logger.info('Updated Insurely data collection ID', {
        priceIntentId,
        dataCollectionId,
      })

      const updatedPriceIntent = priceIntentInsurelyUpdate.priceIntent
      if (updatedPriceIntent && updatedPriceIntent.externalInsurer) {
        success(updatedPriceIntent.externalInsurer)
      } else {
        datadogLogs.logger.error('Failed to update Insurely data collection ID', {
          priceIntentId,
          dataCollectionId,
        })
      }
      close()
    },
    onError(error) {
      console.warn(error)
    },
  })

  const [createDataCollection] = useInsurelyDataCollectionCreateMutation({
    onCompleted(data) {
      const { dataCollectionId } = data.insurelyInitiateIframeDataCollection
      if (dataCollectionId) {
        setDataCollectionId(dataCollectionId)
      } else {
        datadogLogs.logger.error('Failed to create Insurely data collection', {
          priceIntentId,
        })
      }
    },
    onError(error) {
      datadogLogs.logger.error('Error creating Insurely data collection', {
        priceIntentId,
        error,
      })
    },
  })

  const handleInsurelyCollection = (collectionId: string) => {
    createDataCollection({ variables: { collectionId } })
  }

  const handleInsurelyCompleted = useCallback(() => {
    if (dataCollectionId) {
      updateDataCollectionId({
        variables: { priceIntentId, dataCollectionId },
      })
    } else {
      datadogLogs.logger.error('Completed Insurely without creating data collection ID', {
        priceIntentId,
      })
    }
  }, [updateDataCollectionId, priceIntentId, dataCollectionId])

  return (
    <>
      <InputCurrentInsurance
        label={props.label}
        company={props.externalInsurer}
        companyOptions={companyOptions}
        onCompanyChange={handleCompanyChange}
      />
      {isDialogOpen && (
        <Dialog.Root open={true} onOpenChange={close}>
          <StyledDialogContent>
            {state.type === 'COMPARE' ? (
              <DialogIframeWindow>
                <InsurelyIframe
                  configName={state.insurelyConfigName}
                  onCollection={handleInsurelyCollection}
                  onClose={close}
                  onCompleted={handleInsurelyCompleted}
                />
              </DialogIframeWindow>
            ) : (
              <DialogSuccessWindow>
                <Space y={1.5}>
                  <Heading as="h3" variant="standard.20">
                    {t('INSURELY_SUCCESS_PROMPT', { company: state.externalInsurer.displayName })}
                  </Heading>
                  <Button onClick={() => confirm(state.externalInsurer)}>
                    {t('INSURELY_SUCCESS_CONTINUE_BUTTON')}
                  </Button>
                </Space>
              </DialogSuccessWindow>
            )}
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

const StyledDialogContent = styled(Dialog.Content)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.xs,
})

const DialogIframeWindow = styled(Dialog.Window)({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
  height: '100%',
  maxHeight: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderRadius: theme.radius.xs,
})

const DialogSuccessWindow = styled(Dialog.Window)({
  padding: theme.space.md,
  borderRadius: theme.radius.xs,
  width: '100%',
  maxWidth: `calc(${PURCHASE_FORM_MAX_WIDTH} + 1rem)`,
})
