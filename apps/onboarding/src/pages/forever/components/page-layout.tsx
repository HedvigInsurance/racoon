import Head from 'next/head'
import { HedvigLogo } from 'ui'
import { LanguageSwitcher } from './language-switcher'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'

type PageLayoutProps = {
  children: React.ReactNode
  className?: string
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('FOREVER_LANDINGPAGE_TITLE')}</title>

        <meta property="og:title" content={t('FOREVER_LANDINGPAGE_TITLE')} />
        <meta property="og:description" content={t('FOREVER_LANDINGPAGE_DESCRIPTION')} />
        <meta
          property="og:image"
          content="https://www.hedvig.com/new-member-assets/social/forever-notifications.jpg"
        />
      </Head>

      <div className="h-screen flex flex-col p-6 bg-white lg:py-10 lg:px-14">
        <header className="flex-shrink-0 flex justify-center lg:justify-start">
          <a href="/" className="hover:text-purple-900">
            <HedvigLogo />
          </a>
        </header>
        <main className="flex-1 flex flex-col justify-between items-center space-y-10 lg:space-y-0">
          <div
            className={classNames('flex-1 flex flex-col justify-center w-full max-w-sm', className)}
          >
            {children}
          </div>

          <footer className="flex-shrink-0 space-y-10 flex flex-col items-center">
            <div
              className="text-xs lg:text-sm text-gray-700 text-center max-w-xl markdown"
              dangerouslySetInnerHTML={{ __html: t('FOREVER_LANDINGPAGE_INFO_TEXT') }}
            />

            <LanguageSwitcher />
          </footer>
        </main>
      </div>
    </>
  )
}
