import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Button, InputField, Space } from 'ui'
import { useForm } from '@/hooks/useForm'
import { PageLayout } from './PageLayout'
import { usePrintCodeEffect } from './usePrintCodeEffect'

export const ForeverPage = () => {
  const { t } = useTranslation()

  const router = useRouter()
  const initialCode = router.query.code as string | undefined
  const animatedCode = usePrintCodeEffect({ initialCode: initialCode || '' })

  const { state, errors, formProps } = useForm({
    action: '/api/pages/forever',
  })

  const errorMessage = errors?.code ?? errors?.form

  return (
    <form {...formProps}>
      <PageLayout code={initialCode}>
        <Space y={2}>
          <UppercaseInputField
            data-cy="code-input"
            id="code"
            name="code"
            label={t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
            placeholder="7VEKCAG"
            required
            errorMessage={errorMessage ? t(errorMessage) : undefined}
            defaultValue={animatedCode}
          />

          <input hidden name="locale" value={router.locale} readOnly />
          <Button
            type="submit"
            disabled={state === 'submitting'}
            variant="filled"
            color="lavender"
            fullWidth
          >
            {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
          </Button>
        </Space>
      </PageLayout>
    </form>
  )
}

const UppercaseInputField = styled(InputField)({
  textTransform: 'uppercase',
})
