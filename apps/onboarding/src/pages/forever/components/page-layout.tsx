import { HedvigLogo } from 'ui'
import { LanguageSwitcher } from './language-switcher'
import { useTranslation } from 'next-i18next'

type PageLayoutProps = {
  children: React.ReactNode
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const { t } = useTranslation()

  return (
    <div className="h-screen flex flex-col p-6 bg-white xl:py-10 xl:px-14">
      <header className="flex-shrink-0 flex justify-center xl:justify-start">
        <a href="/" className="hover:text-purple-900">
          <HedvigLogo />
        </a>
      </header>
      <main className="flex-1 flex flex-col justify-between items-center space-y-10 xl:space-y-0">
        <div className="flex-1 flex flex-col justify-center w-full max-w-sm xl:space-y-10">
          {children}
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
  )
}
