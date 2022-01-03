/* eslint @next/next/no-html-link-for-pages: 0 */
import type { GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { InputField } from '@/components/input-field'
import { PageLayout } from './components/page-layout'
import { ReadyRedirect } from './components/ready-redirect'
import { marked } from 'marked'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCampaignLazyQuery } from '@/lib/generated-types'
import { usePrintCodeEffect } from './hooks/use-print-code-effect'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const ForeverPage: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const initialCode = router.query.code as string | undefined

  const [code, setCode] = useState('')
  const [apiError, setApiError] = useState<string | undefined>()

  const [fetchCampaign, { error, loading, data }] = useCampaignLazyQuery()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setApiError(undefined)

    try {
      await fetchCampaign({ variables: { code } })
    } catch (error) {
      setApiError(t('FOREVER_ERROR_GENERIC'))
    }
  }

  useEffect(() => {
    if (error) {
      setApiError(t('FOREVER_CODE_ERROR'))
    }
  }, [error, t])

  usePrintCodeEffect({ initialCode, setCode })

  if (data?.campaign) {
    return <ReadyRedirect code={data.campaign.code} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageLayout className="lg:space-y-6" code={initialCode}>
        <div className="flex-1 flex flex-col justify-center space-y-2 lg:flex-initial">
          <label className="text-gray-900 text-sm leading-snug">
            {t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
          </label>
          <InputField
            data-cy="code-input"
            type="text"
            id="code"
            name="code"
            placeholder="7VEKCAG"
            autoComplete="off"
            value={code}
            onChange={({ target: { value } }) => setCode(value)}
            required
            errorMessage={apiError}
          />
        </div>

        <Button type="submit" loading={loading}>
          {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
        </Button>
      </PageLayout>
    </form>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { JSDOM } = await import('jsdom')
  const createDOMPurify = await (await import('dompurify')).default

  const translations = await serverSideTranslations(locale as string)

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window as unknown as Window)

  const markdownFields = ['FOREVER_LANDINGPAGE_INFO_TEXT']
  for (const localeKey of Object.keys(translations._nextI18Next.initialI18nStore)) {
    const localeTranslations = translations._nextI18Next.initialI18nStore[localeKey].common
    for (const markdownField of markdownFields) {
      if (localeTranslations[markdownField]) {
        localeTranslations[markdownField] = DOMPurify.sanitize(
          marked(localeTranslations[markdownField]),
        )
      }
    }
  }

  return {
    props: {
      ...translations,
    },
  }
}

export default ForeverPage
