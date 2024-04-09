import { clsx } from 'clsx'
import Head from 'next/head'
import Link from 'next/link'
import { Children, ComponentProps, type ReactNode } from 'react'
import { Text } from 'ui'
import { breadcrumbItem, breadcrumbsLink, breadcrumbsList } from './PageBreadcrumbs.css'

export type BreadcrumbListItem = {
  label: string
  href?: string
}

type Props = { items: Array<BreadcrumbListItem> }

export const PageBreadcrumbs = (props: Props) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: item.href }),
    })),
  }

  return (
    <>
      <List>
        {props.items.map((item) =>
          item.href ? (
            <ItemLink key={item.href} href={item.href}>
              {item.label}
            </ItemLink>
          ) : (
            <Text size="sm" color="textSecondaryOnGray" key={item.label}>
              {item.label}
            </Text>
          ),
        )}
      </List>

      <Head>
        <script
          key="structured-data-breadcrumb-list"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  )
}

const List = ({ children }: { children: ReactNode }) => {
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

const ItemLink = ({ className, ...forwardedProps }: ComponentProps<typeof Link>) => (
  <Link className={clsx(breadcrumbsLink, className)} {...forwardedProps} />
)
