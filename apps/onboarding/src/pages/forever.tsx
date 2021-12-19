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

  return (
    <div className="h-screen flex flex-col p-2">
      <header className="flex-shrink-0 p-5 flex justify-center">
        <HedvigLogo />
      </header>
      <main className="flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <form className="flex flex-col justify-center space-y-2">
            <label className="text-center">{t('FOREVER_LANDINGPAGE_INPUT_TEXT')}</label>
            <input
              className="border border-gray-300 p-2 w-full rounded"
              type="text"
              placeholder="7VEKCAG"
              value={code}
              onChange={({ target: { value } }) => setCode(value)}
              required
            />

            <button type="submit" className="bg-slate-300 p-2 rounded">
              {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
            </button>
          </form>
        </div>

        <footer className="flex-shrink-0 space-y-2">
          <p>{t('FOREVER_LANDINGPAGE_INFO_TEXT')}</p>

          <div className="flex items-stretch justify-center space-x-2">
            <Link href={router.asPath} locale="se">
              Sv
            </Link>
            <div className="w-px bg-gray-300"></div>
            <Link href={router.asPath} locale="se-en">
              En
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
})

export default ForeverPage
