import { datadogLogs } from '@datadog/browser-logs'
import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, memo } from 'react'
import { Button, yStack } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import {
  activeFormSectionIdAtom,
  GOTO_NEXT_SECTION,
  shopSessionCustomerAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useShopSessionCustomerUpdateMutation } from '@/services/graphql/generated'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useErrorMessage } from '@/utils/useErrorMessage'

const SsnFieldName = 'ssn'

export const SsnSeSectionV2 = memo(({ className }: { className?: string }) => {
  const shopSessionId = useShopSessionId()!
  const shopSessionCustomer = useAtomValue(shopSessionCustomerAtom)
  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const [updateCustomer, result] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted() {
      setActiveSectionId(GOTO_NEXT_SECTION)
    },
    onError(error) {
      datadogLogs.logger.debug(`Failed to update customer ssn: ${error.message}`, { error })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = event.currentTarget[SsnFieldName].value
    if (typeof ssn !== 'string') throw new Error('No SSN found in SSN section form')
    updateCustomer({ variables: { input: { shopSessionId: shopSessionId, ssn } } })
  }

  const handleValidValueEntered = (ssn: string) => {
    updateCustomer({ variables: { input: { shopSessionId: shopSessionId, ssn } } })
  }

  const { t } = useTranslation('purchase-form')
  const errorMessage = useErrorMessage(result.error)

  return (
    <form
      className={clsx(yStack({ gap: errorMessage ? 'md' : 'xxs' }), className)}
      onSubmit={handleSubmit}
    >
      <PersonalNumberField
        label={t('FIELD_SSN_SE_LABEL')}
        name={SsnFieldName}
        defaultValue={shopSessionCustomer?.ssn ?? ''}
        required={true}
        warning={!!errorMessage}
        message={errorMessage}
        onValidValueEntered={handleValidValueEntered}
      />

      <Button type="submit" loading={result.loading} fullWidth={true}>
        {t('SUBMIT_LABEL_PROCEED')}
      </Button>
    </form>
  )
})
SsnSeSectionV2.displayName = 'SsnSeSectionV2'

export const SSN_SE_SECTION_ID = 'ssn-se'
