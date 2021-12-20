import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { HedvigLogo } from 'ui'

const ForeverPage: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [code, setCode] = useState(() => router.query.code as string)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen flex flex-col p-6 bg-white">
        <header className="flex-shrink-0 flex justify-center">
          <a href="/" className="hover:text-purple-900">
            <HedvigLogo />
          </a>
        </header>
        <main className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <label className="text-center text-gray-700">
              {t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
            </label>
            <input
              className="border border-gray-500 py-3 px-6 w-full rounded-lg text-center text-gray-900 text-lg"
              type="text"
              placeholder="7VEKCAG"
              value={code}
              onChange={({ target: { value } }) => setCode(value)}
              required
            />
          </div>

          <footer className="flex-shrink-0 space-y-10">
            <button
              type="submit"
              className="bg-purple-500 text-gray-900 rounded-lg py-3 px-6 w-full"
            >
              {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
            </button>

            <p className="text-xs text-gray-700">{t('FOREVER_LANDINGPAGE_INFO_TEXT')}</p>

            <div className="flex items-stretch justify-center space-x-2">
              <Link href={router.asPath} locale="se">
                <a className="">Sv</a>
              </Link>
              <div className="w-px bg-gray-700" />
              <Link href={router.asPath} locale="se-en">
                En
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </form>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
})

export default ForeverPage
