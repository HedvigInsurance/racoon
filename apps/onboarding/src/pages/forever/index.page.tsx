import type { GetStaticProps, NextPage } from 'next'

import { Button } from 'ui'
import { InputField } from '@/components/input-field'
import { PageLayout } from './components/page-layout'
import { replaceMarkdown } from 'services/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'hooks/use-form'
import { usePrintCodeEffect } from './hooks/use-print-code-effect'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const ForeverPage: NextPage = () => {
  const { t } = useTranslation()

  const router = useRouter()
  const initialCode = router.query.code as string | undefined
  const animatedCode = usePrintCodeEffect({ initialCode: initialCode || '' })

  const { submission, errors, formProps } = useForm({
    action: '/api/pages/forever',
  })

  return (
    <form {...formProps}>
      <PageLayout className="lg:space-y-6" code={initialCode}>
        <div className="flex-1 flex flex-col justify-center space-y-2 lg:flex-initial">
          <label className="text-gray-900 text-sm leading-snug">
            {t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
          </label>
          <InputField
            data-cy="code-input"
            id="code"
            name="code"
            placeholder="7VEKCAG"
            required
            errorMessage={errors?.code ? t(errors?.code) : undefined}
            defaultValue={animatedCode}
          />
        </div>

        <Button type="submit" $loading={submission}>
          {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
        </Button>
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
