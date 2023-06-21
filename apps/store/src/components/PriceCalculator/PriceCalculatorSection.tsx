import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { type FormEventHandler, type ReactNode } from 'react'
import { Button, Space, Text } from 'ui'
import { linkStyles } from '@/components/RichText/RichText.styles'
import { deserializeField } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type FormSection, type JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  section: FormSection
  loading: boolean
  onSubmit: (data: JSONData) => void
  last: boolean
  children: ReactNode
}

export const PriceCalculatorSection = ({ section, loading, onSubmit, last, children }: Props) => {
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()

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
          <Button type="submit" disabled={loading} loading={loading}>
            {translateLabel(section.submitLabel)}
          </Button>

          {last && (
            <Link href={PageLink.privacyPolicy({ locale: routingLocale })} target="_blank">
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
