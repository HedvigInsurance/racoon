import { clsx } from 'clsx'
import Link from 'next/link'
import { Children, ComponentProps, type ReactNode } from 'react'
import { Text } from 'ui'
import {
  breadcrumbItem,
  breadcrumbsLink,
  breadcrumbsList,
} from '@/components/LayoutWithMenu/Breadcumbs.css'

const BreadcrumbList = ({ children }: { children: ReactNode }) => {
  const count = Children.count(children)

  return (
    <>
      <ul className={breadcrumbsList}>
        {Children.map(children, (child, index) => (
          <li className={breadcrumbItem}>
            {child}
            {index < count - 1 && <Text color="textSecondaryOnGray">&middot;</Text>}
          </li>
        ))}
      </ul>
    </>
  )
}

const BreadcrumbLink = ({ className, ...forwardedProps }: ComponentProps<typeof Link>) => (
  <Link className={clsx(breadcrumbsLink, className)} {...forwardedProps} />
)

export const Breadcrumbs = {
  Root: BreadcrumbList,
  Link: BreadcrumbLink,
}
