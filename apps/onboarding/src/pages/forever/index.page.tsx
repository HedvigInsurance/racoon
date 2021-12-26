/* eslint @next/next/no-html-link-for-pages: 0 */
import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { gql, useLazyQuery } from '@apollo/client'
import { HedvigLogo } from 'ui'
import { marked } from 'marked'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { Button } from '@/components/button'
import { InputField } from '@/components/input-field'
import { usePrintCodeEffect } from './hooks/use-print-code-effect'
import { LanguageSwitcher } from './components/language-switcher'
import { ReadyRedirect } from './components/ready-redirect'

const CAMPAIGN_QUERY = gql`
  query Campaign($code: String!) {
    campaign(code: $code) {
      code
    }
  }
`

const ForeverPage: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const [code, setCode] = useState('')
  const [apiError, setApiError] = useState<string | undefined>()

  const [fetchCampaign, { error, loading, data }] = useLazyQuery(CAMPAIGN_QUERY)

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

  useEffect(() => {
    if (code.length === 0) {
      setApiError(undefined)
    }
  }, [code])

  usePrintCodeEffect({ initialCode: router.query.code, setCode })

  if (data) {
    return <ReadyRedirect code={data.campaign.code} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen flex flex-col p-6 bg-white xl:py-10 xl:px-14">
        <header className="flex-shrink-0 flex justify-center xl:justify-start">
          <a href="/" className="hover:text-purple-900">
            <HedvigLogo />
          </a>
        </header>
        <main className="flex-1 flex flex-col justify-between items-center space-y-10 xl:space-y-0">
          <div className="flex-1 flex flex-col justify-center w-full max-w-sm xl:space-y-10">
            <div className="flex-1 flex flex-col justify-center space-y-4 xl:flex-initial">
              <label className="text-center text-gray-700">
                {t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
              </label>
              <InputField
                type="text"
                id="code"
                name="code"
                placeholder="7VEKCAG"
                value={code}
                onChange={({ target: { value } }) => setCode(value)}
                required
                errorMessage={apiError}
              />
            </div>

            <Button type="submit" loading={loading}>
              {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
            </Button>
          </div>

          <footer className="flex-shrink-0 space-y-10 flex flex-col items-center">
            <div
              className="text-xs xl:text-sm text-gray-700 text-center max-w-xl markdown"
              dangerouslySetInnerHTML={{ __html: t('FOREVER_LANDINGPAGE_INFO_TEXT') }}
            />

            <LanguageSwitcher />
          </footer>
        </main>
      </div>
    </form>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
