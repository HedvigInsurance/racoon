import styled from '@emotion/styled'
import { PageLink } from '@/lib/PageLink'
import { StorePageProps } from './StorePage.types'

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
  return (
    <Wrapper>
      <Heading>Store Page</Heading>
      {products.length && (
        <ul>
          {products.map((product) => (
            <li key={product.displayName}>
              <a href={PageLink.product({ id: product.slug })}>{product.displayName}</a>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}
