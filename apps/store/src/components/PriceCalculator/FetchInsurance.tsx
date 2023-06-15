import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type ComponentProps, useCallback, useState, useMemo } from 'react'
import { CrossIcon, Dialog, Text, theme } from 'ui'
import { FetchInsurancePrompt } from '@/components/FetchInsurancePrompt/FetchInsurancePrompt'
import {
  ExternalInsurer,
  useInsurelyDataCollectionCreateMutation,
  usePriceIntentInsurelyUpdateMutation,
} from '@/services/apollo/generated'
import { InsurelyIframe, setInsurelyConfig } from '@/services/Insurely/Insurely'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
  INSURELY_PARTNER,
} from '@/services/Insurely/Insurely.constants'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { FetchInsuranceSuccess } from '../FetchInsuranceSuccess/FetchInsuranceSuccess'
import { useFetchInsuranceState } from './useFetchInsurance'

const logger = datadogLogs.createLogger('FetchInsurance')

type OnCompleted = NonNullable<ComponentProps<typeof InsurelyIframe>['onCompleted']>

type Props = {
  priceIntentId: string
  externalInsurer: ExternalInsurer
  insurelyConfigName: string
  productName: string
}

export const FetchInsurance = ({
  externalInsurer,
  insurelyConfigName,
  priceIntentId,
  productName,
}: Props) => {
  const { shopSession } = useShopSession()
  const loggingContext = useMemo(
    () => ({ priceIntentId, companyName: externalInsurer.displayName, productName }),
    [priceIntentId, externalInsurer.displayName, productName],
  )

  const [state, setState] = useFetchInsuranceState()
  const isOpen = ['PROMPT', 'COMPARE', 'SUCCESS'].includes(state)

  const dismiss = () => setState('DISMISSED')
  const confirm = () => setState('SUCCESS')

  const handleClickConfirm = () => {
    datadogRum.addAction('Fetch Insurance Compare', loggingContext)
    setState('COMPARE')
    setInsurelyConfig({
      company: externalInsurer.insurelyId ?? undefined,
      ssn: shopSession?.customer?.ssn ?? undefined,
    })
  }
  const handleClickSkip = () => {
    datadogRum.addAction('Fetch Insurance Skip', loggingContext)
    dismiss()
  }

  const handleSuccessClick = () => {
    datadogRum.addAction('Fetch Insurance Success', loggingContext)
    dismiss()
  }

  const [dataCollectionId, setDataCollectionId] = useState<string | null>(null)
  const [updateDataCollectionId] = usePriceIntentInsurelyUpdateMutation({
    onCompleted({ priceIntentInsurelyUpdate }) {
      logger.info('Updated Insurely data collection ID', loggingContext)

      const updatedPriceIntent = priceIntentInsurelyUpdate.priceIntent
      if (updatedPriceIntent && updatedPriceIntent.externalInsurer) {
        confirm()
      } else {
        logger.warn('Failed to update Insurely data collection ID', loggingContext)
        dismiss()
      }
    },
    onError(error) {
      logger.warn('Error updating Insurely data collection ID', {
        ...loggingContext,
        error,
      })
    },
  })

  const [createDataCollection] = useInsurelyDataCollectionCreateMutation({
    onCompleted(data) {
      setDataCollectionId(data.insurelyInitiateIframeDataCollection.dataCollectionId)
      logger.addContext('dataCollectionId', dataCollectionId)
    },
    onError(error) {
      logger.warn('Error creating Insurely data collection', {
        ...loggingContext,
        error,
      })
    },
  })

  const handleInsurelyCollection = (collectionId: string) => {
    createDataCollection({ variables: { collectionId, partner: INSURELY_PARTNER } })
  }

  const handleInsurelyCompleted: OnCompleted = useCallback(() => {
    if (dataCollectionId) {
      updateDataCollectionId({
        variables: { priceIntentId, dataCollectionId },
      })
    } else {
      logger.error('Completed Insurely without creating data collection ID', loggingContext)
    }
  }, [updateDataCollectionId, priceIntentId, dataCollectionId, loggingContext])

  return (
    <Dialog.Root open={isOpen} onOpenChange={dismiss}>
      {state === 'PROMPT' && (
        <DialogContent onClose={dismiss} centerContent={true}>
          <DialogWindow>
            <FetchInsurancePrompt
              company={externalInsurer.displayName}
              onClickConfirm={handleClickConfirm}
              onClickSkip={handleClickSkip}
            />
          </DialogWindow>
        </DialogContent>
      )}

      {state === 'COMPARE' && (
        <DialogIframeContent onClose={dismiss} centerContent={true}>
          <DialogIframeWindow>
            <DialogCloseButton>
              <CrossIcon />
            </DialogCloseButton>
            <InsurelyIframe
              configName={insurelyConfigName}
              onCollection={handleInsurelyCollection}
              onClose={dismiss}
              onCompleted={handleInsurelyCompleted}
            />
          </DialogIframeWindow>
        </DialogIframeContent>
      )}

      {state === 'SUCCESS' && (
        <DialogContent onClose={dismiss} centerContent={true}>
          <DialogWindow>
            <FetchInsuranceSuccess
              company={externalInsurer.displayName}
              onClick={handleSuccessClick}
            >
              <Text>
                {externalInsurer.displayName} {productName}
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
  borderRadius: theme.radius.xs,
  width: `calc(100% - ${theme.space.xs} * 2)`,
  maxWidth: '28rem',
  marginInline: 'auto',
})

const DialogContent = styled(Dialog.Content)({ width: '100%' })

const DialogIframeContent = styled(DialogContent)({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
})

const DialogIframeWindow = styled(Dialog.Window)({
  width: '100%',
  maxHeight: '100%',
  height: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderRadius: theme.radius.xs,
})

const DialogCloseButton = styled(Dialog.Close)({
  position: 'absolute',
  top: theme.space.xs,
  right: theme.space.xs,
  cursor: 'pointer',
})
