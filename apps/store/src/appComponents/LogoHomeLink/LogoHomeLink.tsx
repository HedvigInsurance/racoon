import Link from 'next/link'
import { HedvigLogo } from 'ui'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { initTranslationsServerSide } from 'app/i18n'
import { logoStyle } from './LogoHomeLink.css'

type Props = {
  locale?: RoutingLocale
}

export async function LogoHomeLink({ locale = 'se' }: Props) {
  const { t } = await initTranslationsServerSide(locale)

  return (
    <Link
      href={PageLink.home({ locale }).pathname}
      aria-label={t('HOME_PAGE_LINK_LABEL')}
      className={logoStyle}
    >
      <HedvigLogo />
    </Link>
  )
}
