import styled from '@emotion/styled'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { HedvigLogo } from 'ui'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export const LogoHomeLink = () => {
  const { t } = useTranslation('common')
  const locale = useRoutingLocale()

  return (
    <LogoLink href={PageLink.home({ locale }).pathname} aria-label={t('HOME_PAGE_LINK_LABEL')}>
      <HedvigLogo />
    </LogoLink>
  )
}

export const LogoLink = styled(Link)({
  display: 'inline-block',
  '&:active': { opacity: 0.75 },
})
