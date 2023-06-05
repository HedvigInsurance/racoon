import Head from 'next/head'
import { Text } from 'ui'
import { Breadcrumbs } from './Breadcrumbs'

export type BreadcrumbListItem = {
  label: string
  href?: string
}

type Props = { items: Array<BreadcrumbListItem> }

export const BreadcrumbList = (props: Props) => {
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
      <Breadcrumbs.Root>
        {props.items.map((item) =>
          item.href ? (
            <Breadcrumbs.Link key={item.href} href={item.href}>
              {item.label}
            </Breadcrumbs.Link>
          ) : (
            <Text size="sm" color="textSecondaryOnGray" key={item.label}>
              {item.label}
            </Text>
          ),
        )}
      </Breadcrumbs.Root>

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
