import { Link, useLocation } from 'remix'
import { useCurrentLocale, useCurrentMarket } from '~/lib/l10n'

import { Separate } from './separate'
import classNames from 'classnames'

export const LanguageSwitcher = () => {
  const { languages } = useCurrentMarket()
  const location = useLocation()
  const { pathLocale } = useCurrentLocale()

  const pathnameWithoutLocale = location.pathname.split('/').slice(1).join('/')

  return (
    <div className="flex items-stretch justify-center space-x-2">
      <Separate Separator={<div className="w-px bg-gray-700" />}>
        {languages.map((language) => (
          <Link
            key={language.urlParam}
            to={`${language.urlParam}/${pathnameWithoutLocale}`}
            className={classNames(
              'hover:text-gray-900',
              pathLocale === language.urlParam ? 'text-gray-900' : 'text-gray-500',
            )}
          >
            {language.displayName}
          </Link>
        ))}
      </Separate>
    </div>
  )
}
