import styled from '@emotion/styled'
import Link from 'next/link'
import { PageLink } from '@/lib/PageLink'

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

const HomePage = () => {
  return (
    <Wrapper>
      <Heading>Racoon</Heading>
      <Link href={PageLink.landing()}>Landing page</Link>
    </Wrapper>
  )
}

export default HomePage
