'use client'

import styled from '@emotion/styled'
import Head from 'next/head'
import { CreateSessionForm } from './CreateSessionForm'

const Page = () => {
  return (
    <Wrapper>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <CreateSessionForm />
    </Wrapper>
  )
}

export default Page

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  maxWidth: '20rem',
  marginInline: 'auto',
})
