import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { useMemberAreaInfo } from '../../useMemberAreaInfo'
import {
  memberInfo,
  navigation,
  navigationButton,
  navigationItem,
  navigationLink,
  navigationList,
  navItemSkeleton,
} from './Menu.css'

export const Menu = () => {
  const router = useRouter()
  const { firstName, lastName, ssn } = useMemberAreaInfo()
  const locale = useRoutingLocale()
  const { t } = useTranslation('memberArea')
  const formatter = useFormatter()

  const currentRoute = router.pathname
  const memberName = `${firstName} ${lastName}`

  // Remove locale from the pathname to make the comparison work
  const normalisePath = (path: string) => path.replace(/^\/?[^/]+\//, '/')

  const internalLinks = {
    claim: PageLink.memberAreaClaim({ locale }).pathname,
    insurances: PageLink.memberAreaInsurances({ locale }).pathname,
    payments: PageLink.memberAreaPayments({ locale }).pathname,
  }

  return (
    <nav className={navigation}>
      <div className={memberInfo}>
        <Text>{memberName}</Text>
        {ssn && <Text color="textSecondary">{formatter.ssn(ssn)}</Text>}
      </div>
      <ul className={navigationList}>
        <li className={navigationItem}>
          <Link
            className={navigationLink}
            href={internalLinks.insurances}
            data-active={normalisePath(currentRoute) === normalisePath(internalLinks.insurances)}
          >
            {t('MENU_ITEM_LABEL_INSURANCE')}
          </Link>
        </li>
        <li className={navigationItem}>
          <Link
            className={navigationLink}
            href={internalLinks.payments}
            data-active={currentRoute.includes(normalisePath(internalLinks.payments))}
          >
            {t('MENU_ITEM_LABEL_PAYMENT')}
          </Link>
        </li>
        <li className={navigationItem}>
          <Link
            className={navigationLink}
            href={internalLinks.claim}
            data-active={currentRoute.includes(normalisePath(internalLinks.claim))}
          >
            {t('MENU_ITEM_LABEL_CLAIM')}
          </Link>
        </li>
        <li className={navigationItem}>
          <Link className={navigationLink} href={PageLink.faq({ locale })}>
            FAQ
          </Link>
        </li>
        <LogoutButton />
      </ul>
    </nav>
  )
}

const LogoutButton = () => {
  // Perhaps we should have /api/logout route in the future. Using native href would be nice
  const handleLogout = () => {
    resetAuthTokens()
    window.location.reload()
  }

  return (
    <button className={clsx(navigationLink, navigationButton)} onClick={handleLogout}>
      Logout
    </button>
  )
}

export const MenuLoadingState = () => {
  return (
    <div className={navigation}>
      <ul className={navigationList}>
        <Skeleton className={navItemSkeleton} />
        <Skeleton className={navItemSkeleton} />
        <Skeleton className={navItemSkeleton} />
        <Skeleton className={navItemSkeleton} />
        <Skeleton className={navItemSkeleton} />
        <Skeleton className={navItemSkeleton} />
      </ul>
    </div>
  )
}
