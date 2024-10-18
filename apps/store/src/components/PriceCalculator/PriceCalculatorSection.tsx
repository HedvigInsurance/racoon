import styled from '@emotion/styled'
import { useAtomValue } from 'jotai'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, type ReactNode } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { Space, Text } from 'ui'
import { priceCalculatorLoadingAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { linkStyles } from '@/components/RichText/RichText.styles'
import { deserializeField } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type FormSection, type JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  section: FormSection
  onSubmit: (data: JSONData) => void
  last: boolean
  children: ReactNode
}

export const PriceCalculatorSection = ({ section, onSubmit, last, children }: Props) => {
  const locale = useRoutingLocale()
  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()
  const loading = useAtomValue(priceCalculatorLoadingAtom)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data: JSONData = {}

    for (const item of section.items) {
      const deserializedFieldValue = deserializeField(item.field, formData)
      if (deserializedFieldValue !== undefined) {
        data[item.field.name] = deserializedFieldValue
      }
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={0.25}>
        {children}

        <Space as="footer" y={0.25}>
          <Button type="submit" loading={loading} fullWidth={true}>
            {translateLabel(section.submitLabel)}
          </Button>

          {last && (
            <Link href={PageLink.privacyPolicy({ locale })} target="_blank">
              <Text as="span" size="xs">
                {t('GDPR_LINK_BEFORE_OFFER')}
              </Text>
            </Link>
          )}
        </Space>
      </Space>
    </form>
  )
}

const Link = styled(NextLink)(linkStyles, {
  display: 'block',
  textAlign: 'center',
})
