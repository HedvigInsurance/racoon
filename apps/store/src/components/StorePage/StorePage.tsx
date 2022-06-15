import styled from '@emotion/styled'
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
  return (
    <Wrapper>
      <Heading>Store Page</Heading>
      {products?.length && (
        <ul>
          {products.map((product) => (
            <li key={product.name}>
              <a href={`/products/${product.slug}`}>{product.name}</a>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}
