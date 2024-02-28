import * as Checkbox from '@radix-ui/react-checkbox'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { CheckIcon, Text } from 'ui'
import { checkboxIndicator, checkboxRoot, consentBody, consentWrapper } from './MyMoneyConsent.css'
import { concentAcceptedAtom } from './MyMoneyConsentAtom'

export const MyMoneyConsent = () => {
  const { t } = useTranslation('carDealership')
  const [concentAccepted, setConsentAccepted] = useAtom(concentAcceptedAtom)

  const handleCheckedChange = (checked: boolean) => {
    setConsentAccepted(checked)
  }

  return (
    <div className={consentWrapper}>
      <Checkbox.Root
        className={checkboxRoot}
        id="myMoneyConsent"
        checked={concentAccepted}
        onCheckedChange={handleCheckedChange}
      >
        <Checkbox.Indicator className={checkboxIndicator}>
          <CheckIcon size="1rem" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <Text size="md">
        <label htmlFor="myMoneyConsent">{t('MY_MONEY_CONSENT_HEADING')}</label>
      </Text>
      <Text color="textSecondary" size="xxs" className={consentBody}>
        {t('MY_MONEY_CONSENT_BODY')}
      </Text>
    </div>
  )
}
