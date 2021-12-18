import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

const ForeverPage: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [code, setCode] = useState(() => router.query.code as string)

  return (
    <div>
      <header>
        <div>Hedvig</div>
      </header>
      <main>
        <div>
          <form>
            <label>{t('FOREVER_LANDINGPAGE_INPUT_TEXT')}</label>
            <input
              type="text"
              placeholder="7VEKCAG"
              value={code}
              onChange={({ target: { value } }) => setCode(value)}
              required
            />

            <button type="submit">{t('FOREVER_LANDINGPAGE_BTN_LABEL')}</button>
          </form>
        </div>

        <footer>
          <div>
            {t('FOREVER_LANDINGPAGE_INFO_TEXT')}
          </div>

          <div>
            <Link href={router.asPath} locale="se">Sv</Link>
            <div></div>
            <Link href={router.asPath} locale="se-en">En</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
  },
})

export default ForeverPage
