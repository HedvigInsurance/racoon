import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { Button, Heading, yStack } from 'ui'
import { grayCard } from './FetchInsuranceSuccess.css'

type Props = {
  company: string
  onClick: () => void
  children: ReactNode
}

export const FetchInsuranceSuccess = ({ company, onClick, children }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <div className={yStack({ gap: 'md' })}>
      <Dialog.Title asChild={true}>
        <Heading as="h3" variant="standard.18">
          {t('FETCH_INSURANCE_SUCCESS_TITLE', { company })}
        </Heading>
      </Dialog.Title>
      <div className={grayCard}>{children}</div>
      <Button onClick={onClick}>{t('FETCH_INSURANCE_SUCCESS_BUTTON')}</Button>
    </div>
  )
}
