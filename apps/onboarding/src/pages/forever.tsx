/* eslint @next/next/no-html-link-for-pages: 0 */
import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { HedvigLogo } from 'ui'
import { marked } from 'marked'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { useCurrentLocale, useCurrentMarket } from '@/lib/l10n'
import classNames from 'classnames'
import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import { Separate } from '@/components/separate'

const ForeverPage: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [code, setCode] = useState('')
  const { path: urlLocale } = useCurrentLocale()
  const { languages } = useCurrentMarket()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    const initialCode = router.query.code

    if (typeof initialCode === 'string') {
      let charIndex = 0
      setCode('')

      const handle = window.setInterval(() => {
        if (charIndex < initialCode.length) {
          setCode((codePiece) => codePiece + initialCode[charIndex])
          charIndex++
        } else {
          window.clearInterval(handle)
        }
      }, 250)

      return () => {
        window.clearInterval(handle)
      }
    }

    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                placeholder="7VEKCAG"
                value={code}
                onChange={({ target: { value } }) => setCode(value)}
                required
              />
            </div>

            <Button type="submit">{t('FOREVER_LANDINGPAGE_BTN_LABEL')}</Button>
          </div>

          <footer className="flex-shrink-0 space-y-10 flex flex-col items-center">
            <div
              className="text-xs xl:text-sm text-gray-700 text-center max-w-xl markdown"
              dangerouslySetInnerHTML={{ __html: t('FOREVER_LANDINGPAGE_INFO_TEXT') }}
            />

            <div className="flex items-stretch justify-center space-x-2">
              <Separate Separator={<div className="w-px bg-gray-700" />}>
                {languages.map((language) => (
                  <Link key={language.urlParam} href={router.asPath} locale={language.urlParam}>
                    <a
                      className={classNames(
                        'hover:text-gray-900',
                        urlLocale === language.urlParam ? 'text-gray-900' : 'text-gray-500',
                      )}
                    >
                      {language.displayName}
                    </a>
                  </Link>
                ))}
              </Separate>
            </div>
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
