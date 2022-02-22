import { Button, InputField, Space } from 'ui'
import type { GetStaticProps, NextPage } from 'next'

import { PageLayout } from './components/page-layout'
import { replaceMarkdown } from '@/services/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled from '@emotion/styled'
import { useForm } from 'hooks/use-form'
import { usePrintCodeEffect } from './hooks/use-print-code-effect'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const UppercaseInputField = styled(InputField)({
  textTransform: 'uppercase',
})

const ForeverPage: NextPage = () => {
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
            $variant="filled"
            $color="lavender"
            $hasFullWidth
          >
            {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
          </Button>
        </Space>
      </PageLayout>
    </form>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await replaceMarkdown(await serverSideTranslations(locale as string), [
    'FOREVER_LANDINGPAGE_INFO_TEXT',
  ])

  return { props: { ...translations } }
}

export default ForeverPage
