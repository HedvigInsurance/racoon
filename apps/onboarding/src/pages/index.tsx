import styled from '@emotion/styled'
import type { NextPage } from 'next'
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

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Heading>This is a demo:</Heading>
      <Link href={PageLink.forever({ code: '8batky' })}>
        <a>Forever page</a>
      </Link>
      <Link href={PageLink.landing()}>
        <a>Landing page</a>
      </Link>
    </Wrapper>
  )
}

export default Home
