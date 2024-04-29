import { datadogRum } from '@datadog/browser-rum'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { CheckIcon, Text } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { concentAcceptedAtom } from './myMoneyConcentAtom'
import {
  checkboxIndicator,
  checkboxRoot,
  consentBody,
  consentWrapper,
  trigger,
} from './MyMoneyConsent.css'

export const MyMoneyConsent = () => {
  const { t } = useTranslation(['carDealership', 'common'])
  const [concentAccepted, setConsentAccepted] = useAtom(concentAcceptedAtom)
  const [expanded, setExpanded] = useState(false)

  const handleCheckedChange = (checked: boolean) => {
    setConsentAccepted(checked)
    datadogRum.addAction('MyMoney Consent | checkbox toggled', { value: checked })
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
        <label htmlFor="myMoneyConsent">{t('carDealership:MY_MONEY_CONSENT_HEADING')}</label>
      </Text>

      <Collapsible.Root open={expanded} onOpenChange={setExpanded} className={consentBody}>
        <Text color="textSecondary" size="xxs">
          <Text as="span" color="textSecondary" size="xxs">
            {t('carDealership:MY_MONEY_CONSENT_BODY')}
          </Text>
          <Collapsible.Trigger asChild={true}>
            <span className={trigger}>{t('common:READ_MORE')}</span>
          </Collapsible.Trigger>
        </Text>
        <Collapsible.Content style={{ cursor: 'initial' }}>
          <Text as="p" color="textSecondary" size="xxs">
            {t('carDealership:MY_MONEY_CONSENT_BODY_COLLAPSED')}
          </Text>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
