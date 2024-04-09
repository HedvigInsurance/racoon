'use client'

import { useTranslation } from 'next-i18next'
import type { ComponentPropsWithoutRef } from 'react'
import { Space, Text } from 'ui'
import { AttentionCard } from '../InfoCard/InfoCard'

type Props = {
  errors?: Array<string>
} & ComponentPropsWithoutRef<'div'>

export function ErrorMessages({ errors, ...props }: Props) {
  const { t } = useTranslation()

  if (!errors) {
    return null
  }

  return (
    <div {...props}>
      <AttentionCard>
        <Space y={0.5} style={{ width: '100%' }}>
          <Text as="p" size={{ _: 'md', lg: 'lg' }} color="signalAmberText">
            {t('GENERAL_ERROR_DIALOG_TITLE')}
          </Text>
          <Space y={0.5}>
            {errors.map((error) => (
              <Text size={{ _: 'md', lg: 'lg' }} color="signalAmberText" balance={true} key={error}>
                {error}
              </Text>
            ))}
          </Space>
        </Space>
      </AttentionCard>
    </div>
  )
}
