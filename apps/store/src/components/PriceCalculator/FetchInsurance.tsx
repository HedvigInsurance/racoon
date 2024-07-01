import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type ComponentProps, useCallback, useState, useMemo } from 'react'
import { Dialog, Text, theme } from 'ui'
import { FetchInsurancePrompt } from '@/components/FetchInsurancePrompt/FetchInsurancePrompt'
import type { ExternalInsurer } from '@/services/graphql/generated'
import {
  useInsurelyDataCollectionCreateMutation,
  usePriceIntentInsurelyUpdateMutation,
} from '@/services/graphql/generated'
import { InsurelyIframe, setInsurelyConfig } from '@/services/Insurely/Insurely'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'
import { Features } from '@/utils/Features'
import { FetchInsuranceSuccess } from './FetchInsuranceSuccess'
import {
  useFetchInsuranceCompare,
  useFetchInsuranceState,
  useFetchInsuranceSuccess,
} from './useFetchInsurance'

const LOGGER = datadogLogs.createLogger('FetchInsurance')
const USE_NATIVE_SUCCESS = Features.enabled('INSURELY_NATIVE_SUCCESS')

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
      LOGGER.info('Updated Insurely data collection ID', loggingContext)

      const updatedPriceIntent = priceIntentInsurelyUpdate.priceIntent
      if (updatedPriceIntent?.externalInsurer) {
        fetchInsuraceSuccess()
      } else {
        LOGGER.warn('Failed to update Insurely data collection ID', loggingContext)
        dismiss()
      }
    },
    onError(error) {
      LOGGER.warn('Error updating Insurely data collection ID', {
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
      LOGGER.setContextProperty('dataCollectionId', dataCollectionId)
      LOGGER.info(`Created data collection ID: ${dataCollectionId}`)
    },
    onError(error) {
      LOGGER.warn('Error creating Insurely data collection', {
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
      LOGGER.info(
        `Saving Insurely data collection ID: ${dataCollectionId}, priceIntentId: ${props.priceIntentId}`,
      )
      updateDataCollectionId({
        variables: { priceIntentId: props.priceIntentId, dataCollectionId },
      })
    } else {
      LOGGER.error('Completed Insurely without creating data collection ID', loggingContext)
    }
  }, [updateDataCollectionId, props.priceIntentId, dataCollectionId, loggingContext])

  return (
    <Dialog.Root open={isOpen} onOpenChange={dismiss}>
      {state === 'PROMPT' && (
        <DialogContent onClose={dismiss} centerContent={true}>
          <DialogWindow>
            <FetchInsurancePrompt
              company={props.externalInsurer.displayName}
              onClickConfirm={handleClickConfirm}
              onClickSkip={handleClickSkip}
            />
          </DialogWindow>
        </DialogContent>
      )}

      {(state === 'COMPARE' || (USE_NATIVE_SUCCESS && state === 'SUCCESS')) && (
        <DialogIframeContent onClose={dismiss} centerContent={true}>
          <DialogIframeWindow>
            <InsurelyIframe
              configName={props.insurely.configName}
              onCollection={handleInsurelyCollection}
              onClose={dismiss}
              onCompleted={handleInsurelyCompleted}
            />
          </DialogIframeWindow>
        </DialogIframeContent>
      )}

      {!USE_NATIVE_SUCCESS && state === 'SUCCESS' && (
        <DialogContent onClose={dismiss} centerContent={true}>
          <DialogWindow>
            <FetchInsuranceSuccess
              company={props.externalInsurer.displayName}
              onClick={handleClickDismiss}
            >
              <Text>
                {props.externalInsurer.displayName} {props.productName}
              </Text>
            </FetchInsuranceSuccess>
          </DialogWindow>
        </DialogContent>
      )}
    </Dialog.Root>
  )
}

const DialogWindow = styled(Dialog.Window)({
  padding: theme.space.md,
  paddingTop: theme.space.lg,
  borderRadius: theme.radius.xxs,
  width: `calc(100% - ${theme.space.xs} * 2)`,
  maxWidth: '28rem',
  marginInline: 'auto',
})

const DialogContent = styled(Dialog.Content)({
  width: '100%',
  alignSelf: 'center',
})

const DialogIframeContent = styled(Dialog.Content)({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,

  [`@media (min-height: ${INSURELY_IFRAME_MAX_HEIGHT}px)`]: {
    alignSelf: 'center',
  },
})

const DialogIframeWindow = styled(Dialog.Window)({
  width: '100%',
  maxHeight: '100%',
  height: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderRadius: theme.radius.xxs,
})
