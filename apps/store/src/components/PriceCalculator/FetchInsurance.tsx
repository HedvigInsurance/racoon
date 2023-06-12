import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useCallback, useState } from 'react'
import { Button, CrossIcon, Dialog, Heading, Space, theme } from 'ui'
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
} from '@/services/Insurely/Insurely.constants'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useFetchInsuranceState } from './useFetchInsurance'

const logger = datadogLogs.createLogger('FetchInsurance')

type Props = {
  priceIntentId: string
  externalInsurer: ExternalInsurer
  insurelyConfigName: string
}

export const FetchInsurance = ({ externalInsurer, insurelyConfigName, priceIntentId }: Props) => {
  const { t } = useTranslation('purchase-form')
  const { shopSession } = useShopSession()

  const [state, setState] = useFetchInsuranceState()
  const isOpen = ['PROMPT', 'COMPARE', 'SUCCESS'].includes(state)

  const compare = () => {
    setState('COMPARE')
    setInsurelyConfig({
      company: externalInsurer.insurelyId ?? undefined,
      ssn: shopSession?.customer?.ssn ?? undefined,
    })
  }
  const skip = () => setState('SKIPPED')
  const confirm = () => setState('SUCCESS')

  const [dataCollectionId, setDataCollectionId] = useState<string | null>(null)
  const [updateDataCollectionId] = usePriceIntentInsurelyUpdateMutation({
    onCompleted({ priceIntentInsurelyUpdate }) {
      logger.info('Updated Insurely data collection ID', { priceIntentId })

      const updatedPriceIntent = priceIntentInsurelyUpdate.priceIntent
      if (updatedPriceIntent && updatedPriceIntent.externalInsurer) {
        confirm()
      } else {
        logger.warn('Failed to update Insurely data collection ID', { priceIntentId })
      }
      skip()
    },
    onError(error) {
      logger.warn('Error updating Insurely data collection ID', {
        priceIntentId,
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
      logger.error('Completed Insurely without creating data collection ID', { priceIntentId })
    }
  }, [updateDataCollectionId, priceIntentId, dataCollectionId])

  return (
    <Dialog.Root open={isOpen} onOpenChange={skip}>
      {state === 'PROMPT' && (
        <Dialog.Content onClose={skip} centerContent={true}>
          <DialogWindow>
            <FetchInsurancePrompt
              company={externalInsurer.displayName}
              onClickConfirm={compare}
              onClickSkip={skip}
            />
          </DialogWindow>
        </Dialog.Content>
      )}

      {state === 'COMPARE' && (
        <DialogIframeContent onClose={skip} centerContent={true}>
          <DialogIframeWindow>
            <DialogCloseButton>
              <CrossIcon />
            </DialogCloseButton>
            <InsurelyIframe
              configName={insurelyConfigName}
              onCollection={handleInsurelyCollection}
              onClose={skip}
              onCompleted={handleInsurelyCompleted}
            />
          </DialogIframeWindow>
        </DialogIframeContent>
      )}

      {state === 'SUCCESS' && (
        <Dialog.Content onClose={skip} centerContent={true}>
          <DialogWindow>
            <Space y={1.5}>
              <Heading as="h3" variant="standard.20">
                {t('INSURELY_SUCCESS_PROMPT', { company: externalInsurer.displayName })}
              </Heading>
              <Button onClick={confirm}>{t('INSURELY_SUCCESS_CONTINUE_BUTTON')}</Button>
            </Space>
          </DialogWindow>
        </Dialog.Content>
      )}
    </Dialog.Root>
  )
}

const DialogWindow = styled(Dialog.Window)({
  padding: theme.space.md,
  paddingTop: theme.space.lg,
  borderRadius: theme.radius.xs,
  width: `calc(100% - ${theme.space.xs} * 2)`,
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
  marginInline: 'auto',
})

const DialogIframeContent = styled(Dialog.Content)({
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
