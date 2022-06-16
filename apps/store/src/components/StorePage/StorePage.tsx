import styled from '@emotion/styled'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { PageLink } from '@/lib/PageLink'
import { StorePageProps } from '@/pages/store'

const Wrapper = styled.main({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

const Heading = styled.h1({
  fontWeight: 'bold',
})

export const StorePage = ({ products }: StorePageProps) => {
  const { locale } = useCurrentLocale()

  return (
    <Wrapper>
      <Heading>Store Page</Heading>
      {products?.length && (
        <ul>
          {products.map((product) => (
            <li key={product.name}>
              <a href={PageLink.product({ locale, id: product.slug })}>{product.name}</a>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}
