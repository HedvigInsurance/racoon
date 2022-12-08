import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useCallback, useState } from 'react'
import { Dialog } from 'ui'
import {
  useExternalInsurersQuery,
  useExternalInsurerUpdateMutation,
} from '@/services/apollo/generated'
import { InsurelyIframe } from '@/services/Insurely/Insurely'
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
  const updateExternalInsurer = useUpdateExternalInsurer(priceIntentId)

  const [isInsurelyModalOpen, setIsInsurelyModalOpen] = useState(false)
  const handleCompanyChange = (company?: string) => {
    if (company) setIsInsurelyModalOpen(true)
    updateExternalInsurer(company)
  }

  const handleInsurelyCollection = useCallback((collectionId: string) => {
    // @TODO: send to API
    console.log('COLLECTION', collectionId)
  }, [])

  const handleInsurelyCompleted = useCallback(() => {
    setIsInsurelyModalOpen(false)
  }, [])

  const handleInsurelyClose = useCallback(() => setIsInsurelyModalOpen(false), [])

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
                // @TODO: fetch from API
                clientId="713b65c7-5613-4395-b1b8-db0028d5a9d2"
                // @TODO: convert from "company"
                company={'se-demo'}
                // @TODO: get from price intent
                personalNumber={'200001020000'}
                onCollection={handleInsurelyCollection}
                onClose={handleInsurelyClose}
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

  const { locale } = useCurrentLocale()
  return (externalInsurerId?: string) => {
    datadogLogs.logger.info('Updating external insurer', { priceIntentId, externalInsurerId })
    updateExternalInsurer({
      variables: { priceIntentId, externalInsurer: externalInsurerId, locale },
    })
  }
}

const StyledDialogContent = styled(Dialog.Content)({
  display: 'flex',
  alignItems: 'center',
})

const StyledDialogWindow = styled(Dialog.Window)(({ theme }) => ({
  marginInline: theme.space[2],
  marginTop: theme.space[2],
  borderRadius: theme.radius.xs,
}))
