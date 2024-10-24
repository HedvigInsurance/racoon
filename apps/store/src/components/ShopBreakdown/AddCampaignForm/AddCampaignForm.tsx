import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { TextField } from '@/components/TextField/TextField'
import { button, wrapper } from './AddCampaignForm.css'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  onAdd: (campaignCode: string) => void
  loading: boolean
  errorMessage?: string
}

export const AddCampaignForm = (props: Props) => {
  const { t } = useTranslation('cart')

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const code = formData.get(FORM_CAMPAIGN_CODE)
    if (typeof code === 'string') {
      props.onAdd(code.toUpperCase())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={wrapper}>
        <TextField
          name={FORM_CAMPAIGN_CODE}
          label={t('CAMPAIGN_CODE_INPUT_LABEL')}
          size="small"
          warning={!!props.errorMessage}
          message={props.errorMessage}
          required={true}
          upperCaseInput={true}
        />
        <Button className={button} type="submit" variant="primary-alt" loading={props.loading}>
          {t('CHECKOUT_ADD_DISCOUNT_BUTTON')}
        </Button>
      </div>
    </form>
  )
}
