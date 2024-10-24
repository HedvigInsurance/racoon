import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { type ComponentProps, useCallback, useState, useMemo, type ReactNode } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { Text, visuallyHidden } from 'ui'
import { FetchInsurancePrompt } from '@/components/FetchInsurancePrompt/FetchInsurancePrompt'
import type { ExternalInsurer } from '@/services/graphql/generated'
import {
  useInsurelyDataCollectionCreateMutation,
  usePriceIntentInsurelyUpdateMutation,
} from '@/services/graphql/generated'
import { InsurelyIframe, setInsurelyConfig } from '@/services/Insurely/InsurelyIframe'
import {
  dialogContent,
  dialogIframeContent,
  dialogIframeWindow,
  dialogWindow,
  actions,
} from './FetchInsurance.css'
import { FetchInsuranceSuccess } from './FetchInsuranceSuccess'
import {
  useFetchInsuranceCompare,
  useFetchInsuranceState,
  useFetchInsuranceSuccess,
} from './useFetchInsurance'

const datadogLogger = datadogLogs.createLogger('FetchInsurance')

type OnCompleted = NonNullable<ComponentProps<typeof InsurelyIframe>['onCompleted']>

type Props = {
  customerSsn?: string
  priceIntentId: string
  externalInsurer: ExternalInsurer
  insurely: { configName: string; partner: string }
  productName: string
}

export const FetchInsurance = (props: Props) => {
  const loggingContext = useMemo(
    () => ({
      priceIntentId: props.priceIntentId,
      companyName: props.externalInsurer.displayName,
      productName: props.productName,
    }),
    [props.priceIntentId, props.externalInsurer.displayName, props.productName],
  )

  const [state, setState] = useFetchInsuranceState()
  const fetchInsuranceCompare = useFetchInsuranceCompare()
  const fetchInsuraceSuccess = useFetchInsuranceSuccess()
  const [hasInsurelyLoaded, setHasInsurelyLoaded] = useState(false)
  const isOpen = ['PROMPT', 'COMPARE', 'SUCCESS'].includes(state)

  const dismiss = () => setState('DISMISSED')

  const handleClickConfirm = () => {
    datadogRum.addAction('Fetch Insurance Compare', loggingContext)
    fetchInsuranceCompare()
    setInsurelyConfig({
      company: props.externalInsurer.insurelyId ?? undefined,
      ssn: props.customerSsn ?? undefined,
    })
  }
  const handleClickSkip = () => {
    datadogRum.addAction('Fetch Insurance Skip', loggingContext)
    dismiss()
  }
  const handleClickDismiss = () => {
    datadogRum.addAction('Fetch Insurance Dismiss', loggingContext)
    dismiss()
  }

  const [dataCollectionId, setDataCollectionId] = useState<string | null>(null)
  const [updateDataCollectionId] = usePriceIntentInsurelyUpdateMutation({
    onCompleted({ priceIntentInsurelyUpdate }) {
      datadogLogger.info('Updated Insurely data collection ID', loggingContext)

      const updatedPriceIntent = priceIntentInsurelyUpdate.priceIntent
      if (updatedPriceIntent?.externalInsurer) {
        fetchInsuraceSuccess()
      } else {
        datadogLogger.warn('Failed to update Insurely data collection ID', loggingContext)
        dismiss()
      }
    },
    onError(error) {
      datadogLogger.warn('Error updating Insurely data collection ID', {
        ...loggingContext,
        error,
      })
    },
  })

  const [createDataCollection] = useInsurelyDataCollectionCreateMutation({
    onCompleted(data) {
      const { dataCollectionId } = data.insurelyInitiateIframeDataCollection
      setDataCollectionId(dataCollectionId)
      // TODO: Debug and fix, we're not seeing the value in Datadog
      datadogLogger.setContextProperty('dataCollectionId', dataCollectionId)
      datadogLogger.info(`Created data collection ID: ${dataCollectionId}`)
    },
    onError(error) {
      datadogLogger.warn('Error creating Insurely data collection', {
        ...loggingContext,
        error,
      })
    },
  })

  const handleInsurelyCollection = (collectionId: string) => {
    createDataCollection({ variables: { collectionId, partner: props.insurely.partner } })
  }

  const handleInsurelyCompleted: OnCompleted = useCallback(() => {
    if (dataCollectionId) {
      datadogLogger.info(
        `Saving Insurely data collection ID: ${dataCollectionId}, priceIntentId: ${props.priceIntentId}`,
      )
      updateDataCollectionId({
        variables: { priceIntentId: props.priceIntentId, dataCollectionId },
      })
    } else {
      datadogLogger.error('Completed Insurely without creating data collection ID', loggingContext)
    }
  }, [updateDataCollectionId, props.priceIntentId, dataCollectionId, loggingContext])

  const handleInsurelyLoaded = useCallback(() => setHasInsurelyLoaded(true), [])

  const { t } = useTranslation('purchase-form')

  let content: ReactNode = null
  if (state === 'PROMPT') {
    content = (
      <Dialog.Content className={dialogContent} onClose={dismiss} centerContent={true}>
        <Dialog.Window className={dialogWindow}>
          <FetchInsurancePrompt
            company={props.externalInsurer.displayName}
            onClickConfirm={handleClickConfirm}
            onClickSkip={handleClickSkip}
          />
        </Dialog.Window>
      </Dialog.Content>
    )
  } else if (state === 'COMPARE') {
    content = (
      <Dialog.Content className={dialogIframeContent} onClose={dismiss} centerContent={true}>
        <Dialog.Window className={dialogIframeWindow}>
          <Dialog.Title className={visuallyHidden}>
            {t('FETCH_INSURANCE_PROMPT_TITLE', {
              company: props.externalInsurer.displayName,
            })}
          </Dialog.Title>
          <InsurelyIframe
            configName={props.insurely.configName}
            onCollection={handleInsurelyCollection}
            onLoaded={handleInsurelyLoaded}
            onCompleted={handleInsurelyCompleted}
          />
          {hasInsurelyLoaded && (
            <div className={actions}>
              <Dialog.Close asChild>
                <Button>{t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}</Button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Window>
      </Dialog.Content>
    )
  } else if (state === 'SUCCESS') {
    content = (
      <Dialog.Content className={dialogContent} onClose={dismiss} centerContent={true}>
        <Dialog.Window className={dialogWindow}>
          <FetchInsuranceSuccess
            company={props.externalInsurer.displayName}
            onClick={handleClickDismiss}
          >
            <Text>
              {props.externalInsurer.displayName} {props.productName}
            </Text>
          </FetchInsuranceSuccess>
        </Dialog.Window>
      </Dialog.Content>
    )
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={dismiss}>
      {content}
    </Dialog.Root>
  )
}
