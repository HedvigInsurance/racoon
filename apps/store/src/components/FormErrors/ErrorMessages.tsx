'use client'

import { useTranslation } from 'next-i18next'
import { ComponentPropsWithoutRef } from 'react'
import { Space, Text, WarningTriangleIcon, theme } from 'ui'
import { header, heading, warningIcon } from './ErrorMessages.css'

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
      <div className={header}>
        <WarningTriangleIcon size="1em" color={theme.colors.amber600} className={warningIcon} />
        <Text className={heading} size={{ _: 'md', lg: 'lg' }}>
          {t('GENERAL_ERROR_DIALOG_TITLE')}
        </Text>
      </div>
      <Space y={0.125}>
        {errors.map((error) => (
          <Text size={{ _: 'md', lg: 'lg' }} color="textSecondary" balance={true} key={error}>
            {error}
          </Text>
        ))}
      </Space>
    </div>
  )
}
