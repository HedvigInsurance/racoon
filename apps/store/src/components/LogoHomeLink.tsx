import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { HedvigLogo } from 'ui'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { link } from './LogoHomeLink.css'

export const LogoHomeLink = () => {
  const { t } = useTranslation('common')
  const locale = useRoutingLocale()

  // Optimization: we don't want prefetch on navigation element, it's always visible
  // and not used often enough to justify eager preload.
  // Not prefetching also makes it easier to measure page-specific performance
  // (no extra resources from preloaded pages)
  return (
    <Link
      className={link}
      href={PageLink.home({ locale }).pathname}
      aria-label={t('HOME_PAGE_LINK_LABEL')}
      prefetch={false}
    >
      <HedvigLogo />
    </Link>
  )
}
