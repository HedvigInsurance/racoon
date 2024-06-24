import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { Button, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'

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
      <Wrapper>
        <UppercaseTextField
          name={FORM_CAMPAIGN_CODE}
          label={t('CAMPAIGN_CODE_INPUT_LABEL')}
          size="small"
          warning={!!props.errorMessage}
          message={props.errorMessage}
          required={true}
        />
        <Button type="submit" variant="primary-alt" loading={props.loading} fullWidth={true}>
          {t('CHECKOUT_ADD_DISCOUNT_BUTTON')}
        </Button>
      </Wrapper>
    </form>
  )
}

const Wrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(33%, min-content)',
  gap: theme.space.xs,
})

const UppercaseTextField = styled(TextField)({ textTransform: 'uppercase' })
