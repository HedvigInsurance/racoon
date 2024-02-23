import * as Checkbox from '@radix-ui/react-checkbox'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { CheckIcon, Text } from 'ui'
import { checkboxIndicator, checkboxRoot, consentBody, consentWrapper } from './MyMoneyConsent.css'

export const MyMoneyConsent = () => {
  const { t } = useTranslation('carDealership')
  return (
    <div className={consentWrapper}>
      <Checkbox.Root className={checkboxRoot} id="myMoneyConsent">
        <Checkbox.Indicator className={checkboxIndicator}>
          <CheckIcon size="1rem" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <Text size="lg">
        <label htmlFor="myMoneyConsent">{t('MY_MONEY_CONSENT_HEADING')}</label>
      </Text>
      <Text color="textSecondary" size="xxs" className={consentBody}>
        {t('MY_MONEY_CONSENT_BODY')}
      </Text>
    </div>
  )
}
