import Link from 'next/link'
import type { NextPage } from 'next'
import { PageLink } from '@/lib/page-link'
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

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Heading>This is a demo:</Heading>
      <Link href={PageLink.forever({ code: '8batky' })}>
        <a>Forever page</a>
      </Link>
    </Wrapper>
  )
}

export default Home
