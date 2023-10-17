import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Button, Heading, Space, theme } from 'ui'

type Props = {
  company: string
  onClick: () => void
  children: ReactNode
}

export const FetchInsuranceSuccess = ({ company, onClick, children }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Space y={1.5}>
      <Heading as="h3" variant="standard.18">
        {t('FETCH_INSURANCE_SUCCESS_TITLE', { company })}
      </Heading>
      <Space y={1}>
        <GrayCard>{children}</GrayCard>
        <Button onClick={onClick}>{t('FETCH_INSURANCE_SUCCESS_BUTTON')}</Button>
      </Space>
    </Space>
  )
}

const GrayCard = styled.div({
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.xxs,
  padding: theme.space.md,
})
