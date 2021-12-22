import { useRouter } from 'next/router'
import { Separate } from '@/components/separate'
import { useCurrentMarket } from '@/lib/l10n'
import classNames from 'classnames'
import Link from 'next/link'

export const LanguageSwitcher = () => {
  const router = useRouter()
  const { languages } = useCurrentMarket()

  return (
    <div className="flex items-stretch justify-center space-x-2">
      <Separate Separator={<div className="w-px bg-gray-700" />}>
        {languages.map((language) => (
          <Link key={language.urlParam} href={router.asPath} locale={language.urlParam}>
            <a
              className={classNames(
                'hover:text-gray-900',
                router.locale === language.urlParam ? 'text-gray-900' : 'text-gray-500',
              )}
            >
              {language.displayName}
            </a>
          </Link>
        ))}
      </Separate>
    </div>
  )
}
