import styled from '@emotion/styled'

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

export const StorePage = () => {
  return (
    <Wrapper>
      <Heading>Store Page</Heading>
      <p>Not yet implemented</p>
    </Wrapper>
  )
}
