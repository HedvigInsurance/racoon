'use client'

import Head from 'next/head'
import { CreateSessionForm } from './CreateSessionForm'
import { Wrapper } from './styles'

const Page = () => {
  return (
    <Wrapper>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <CreateSessionForm />
    </Wrapper>
  )
}

export default Page
