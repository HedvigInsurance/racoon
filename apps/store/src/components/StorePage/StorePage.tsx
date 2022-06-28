import Link from 'next/link'
import { Heading, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { StorePageProps } from './StorePage.types'

export const StorePage = ({ products }: StorePageProps) => {
  return (
    <>
      <Heading headingLevel="h1" colorVariant="dark" variant="l">
        Store Page
      </Heading>
      <Space y={2}>
        {products.length && (
          <ul>
            <Space y={1}>
              {products.map((product) => (
                <li key={product.slug}>
                  <Link href={PageLink.product({ id: product.slug })}>{product.displayName}</Link>
                </li>
              ))}
            </Space>
          </ul>
        )}
        <div>
          <Link href={PageLink.cart()}>Go to cart</Link>
        </div>
      </Space>
    </>
  )
}
